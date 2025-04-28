
'use server';
/**
 * @fileOverview Sends an email notification to the admin when a customer requests a password reset.
 *
 * - sendPasswordResetRequestEmail - Function to trigger the email sending flow.
 * - SendPasswordResetRequestEmailInput - Input type for the flow.
 * - SendPasswordResetRequestEmailOutput - Output type for the flow (simple success/failure).
 */

import { ai } from '@/ai/ai-instance';
import { z } from 'genkit';

// Define input schema for the flow
const SendPasswordResetRequestEmailInputSchema = z.object({
  customerEmail: z.string().email().describe('The email address of the customer requesting the reset.'),
});
export type SendPasswordResetRequestEmailInput = z.infer<typeof SendPasswordResetRequestEmailInputSchema>;

// Define output schema for the flow
const SendPasswordResetRequestEmailOutputSchema = z.object({
  success: z.boolean().describe('Indicates whether the notification email was sent successfully.'),
  message: z.string().optional().describe('Optional message regarding the email sending status.'),
});
export type SendPasswordResetRequestEmailOutput = z.infer<typeof SendPasswordResetRequestEmailOutputSchema>;

// Exported function to call the flow
export async function sendPasswordResetRequestEmail(input: SendPasswordResetRequestEmailInput): Promise<SendPasswordResetRequestEmailOutput> {
  return sendPasswordResetRequestEmailFlow(input);
}

// Define the prompt for generating the email content
const emailPrompt = ai.definePrompt({
  name: 'passwordResetRequestEmailPrompt',
  input: {
    schema: SendPasswordResetRequestEmailInputSchema,
  },
  output: {
    // Outputting structured email content (subject and body)
    schema: z.object({
       subject: z.string().describe("The subject line for the admin notification email."),
       body: z.string().describe("The plain text body content for the admin notification email.")
    })
  },
  prompt: `Generate an admin notification email for Bhattarai Kirana Pasal.

A customer has requested a password reset.

Customer Email: {{{customerEmail}}}

Please verify this request and take appropriate action if needed (e.g., manually send a reset link or contact the customer).

The subject should be something like "Password Reset Request from Customer".
The body should be plain text, clearly stating the customer's email and the nature of the request.
`,
});

// Define the flow to generate and (theoretically) send the email
const sendPasswordResetRequestEmailFlow = ai.defineFlow<
  typeof SendPasswordResetRequestEmailInputSchema,
  typeof SendPasswordResetRequestEmailOutputSchema
>(
  {
    name: 'sendPasswordResetRequestEmailFlow',
    inputSchema: SendPasswordResetRequestEmailInputSchema,
    outputSchema: SendPasswordResetRequestEmailOutputSchema,
  },
  async (input) => {
    try {
      // 1. Generate the email content using the prompt
      const { output } = await emailPrompt(input);

      if (!output || !output.subject || !output.body) {
        console.error("Failed to generate password reset request email content.");
        return { success: false, message: 'Failed to generate email content.' };
      }

      const { subject, body } = output;
      // Hardcoded admin email address
      const adminRecipient = "nikeshdon66@gmail.com";

      // 2. Simulate sending the email to the admin
      // Replace this console log with actual email sending logic using Nodemailer or similar.
      console.log(`--- Sending Password Reset Request Notification ---`);
      console.log(`To: ${adminRecipient}`);
      console.log(`Subject: ${subject}`);
      console.log(`Body (Plain Text):\n${body}`);
      console.log(`--- Email Sent (Simulated) ---`);

      // Simulate a successful send for now
      await new Promise(resolve => setTimeout(resolve, 100)); // Simulate network delay

      return { success: true, message: 'Admin notification email sent successfully (simulated).' };

    } catch (error) {
      console.error('Error in sendPasswordResetRequestEmailFlow:', error);
      return { success: false, message: error instanceof Error ? error.message : 'An unknown error occurred while sending the notification email.' };
    }
  }
);

// IMPORTANT: This flow ONLY notifies the admin. It does NOT send a reset link to the customer.
// Actual password reset functionality requires secure token generation, backend validation,
// and sending a separate email to the customer, which is beyond the scope of this notification flow.
