import { env } from '@/env'; // Ensure env includes AUTH0_WEBHOOK_SECRET
import { analytics } from '@repo/analytics/posthog/server';
import { log } from '@repo/observability/log';
import { headers } from 'next/headers';
import { NextResponse } from 'next/server';

// Define a generic type for Auth0 user data for now.
// This will need to be refined based on the actual Auth0 event payloads.
interface Auth0User {
  user_id: string;
  email?: string;
  name?: string; // Auth0 might send name, given_name, family_name
  picture?: string;
  // Add other relevant fields based on Auth0's user profile
}

interface Auth0Organization {
  id: string;
  name?: string;
  // Add other relevant fields
}

interface Auth0Event {
  type: string; // e.g., 'sapi_user_created', 'sapi_user_updated', 'sapi_user_deleted'
  user?: Auth0User;
  organization?: Auth0Organization;
  // Other event-specific data
  [key: string]: any; // Allow other properties
}

// Simplified event handler for now
const handleEvent = (event: Auth0Event) => {
  log.info('Auth0 Webhook Event Received:', { type: event.type, data: event });

  // Example: User created event (adjust type based on actual Auth0 event type)
  // Auth0 user event types are typically like:
  // - Pre User Registration: 'pre-user-registration'
  // - Post User Registration: 'post-user-registration' (good for user created)
  // - Post Change Password: 'post-change-password'
  // - User Login: 's', 'fu', 'fua' (success, failed, failed user action)
  // - User Management API events: 'sapi_user_created', 'sapi_user_updated', 'sapi_user_deleted'
  // We will assume Management API events for now as they are more explicit for CRUD.

  const user = event.user;
  const organization = event.organization; // Auth0 uses 'organizations' add-on

  if (user) {
    analytics.identify({
      distinctId: user.user_id,
      properties: {
        email: user.email,
        name: user.name, // Or construct from given_name, family_name
        avatar: user.picture,
        // Map other relevant user properties from Auth0
      },
    });
  }

  // Basic event capture
  analytics.capture({
    event: event.type, // Use Auth0 event type directly or map it
    distinctId: user?.user_id || 'system', // Fallback for non-user events
    properties: event, // Send the whole event data for now
  });

  // Organization handling would require Auth0's Organizations feature
  // and corresponding webhook events.
  if (organization && user) { // Assuming user context for organization event
     analytics.groupIdentify({
        groupKey: organization.id,
        groupType: 'company', // Or your preferred group type
        distinctId: user.user_id, // User associated with this org event
        properties: {
          name: organization.name,
          // map other org properties
        },
    });
  }


  return new Response(\`Event \${event.type} handled\`, { status: 200 });
};

export const POST = async (request: Request): Promise<Response> => {
  if (!env.AUTH0_WEBHOOK_SECRET) {
    log.warn('Auth0 webhook secret is not configured.');
    return NextResponse.json({ message: 'Auth0 webhook secret not configured', ok: false }, { status: 503 });
  }

  const headerPayload = headers();
  const authorizationToken = headerPayload.get('authorization');

  // Verify the secret token
  // Auth0 sends the secret in an 'authorization' header, e.g., "Bearer YOUR_SECRET"
  // Or you can configure a custom header. Standard practice is Authorization.
  if (!authorizationToken || authorizationToken !== \`Bearer \${env.AUTH0_WEBHOOK_SECRET}\`) {
    log.warn('Auth0 webhook unauthorized access attempt.');
    return new Response('Unauthorized', { status: 401 });
  }

  let eventPayload: Auth0Event;
  try {
    eventPayload = await request.json();
  } catch (error) {
    log.error('Error parsing Auth0 webhook payload:', { error });
    return new Response('Invalid payload', { status: 400 });
  }

  // Ensure payload is an array of events (some Auth0 webhooks send batches) or a single event
  // For simplicity, this example assumes a single event structure.
  // If Auth0 sends batches, you'll need to iterate through them.
  // Check Auth0 documentation for the specific webhook type you're using.
  // For example, some logs stream events in an array.
  if (Array.isArray(eventPayload)) {
      for (const event of eventPayload) {
          handleEvent(event as Auth0Event); // Process each event
      }
      await analytics.shutdown();
      return new Response('Events handled', { status: 200 });
  } else {
      const response = handleEvent(eventPayload as Auth0Event);
      await analytics.shutdown();
      return response;
  }
};
