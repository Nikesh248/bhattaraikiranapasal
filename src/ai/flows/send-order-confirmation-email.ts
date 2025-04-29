
'use server';
/**
 * @fileOverview Sends an order confirmation email.
 *
 * - sendOrderConfirmationEmail - Function to trigger the email sending flow.
 * - SendOrderConfirmationEmailInput - Input type for the flow.
 * - SendOrderConfirmationEmailOutput - Output type for the flow (simple success/failure).
 */

import { ai, ensureAiIsConfigured, isAiConfigured } from '@/ai/ai-instance';
import { z } from 'genkit';

// Define input schema for the email flow
const SendOrderConfirmationEmailInputSchema = z.object({
  recipientEmail: z.string().email().describe('The email address of the recipient.'),
  userName: z.string().describe("The name of the customer placing the order."),
  userEmail: z.string().email().optional().describe("The email address of the customer (optional)."),
  orderItems: z.array(z.object({
    name: z.string(),
    quantity: z.number(),
    price: z.number(),
  })).describe("An array of items in the order."),
  subtotal: z.number().describe("The subtotal cost of the items."),
  shippingCost: z.number().describe("The cost of shipping."),
  totalAmount: z.number().describe("The total amount charged for the order."),
  paymentMethod: z.string().describe("The payment method used."),
  shippingAddress: z.object({
     name: z.string(),
     address: z.string(),
     city: z.string(),
     province: z.string(),
     postalCode: z.string(),
     phoneNumber: z.string(),
  }).describe("The shipping address for the order."),
});
export type SendOrderConfirmationEmailInput = z.infer<typeof SendOrderConfirmationEmailInputSchema>;

// Define output schema for the email flow
const SendOrderConfirmationEmailOutputSchema = z.object({
  success: z.boolean().describe('Indicates whether the email was sent successfully.'),
  message: z.string().optional().describe('Optional message regarding the email sending status.'),
});
export type SendOrderConfirmationEmailOutput = z.infer<typeof SendOrderConfirmationEmailOutputSchema>;

// Exported function to call the flow
export async function sendOrderConfirmationEmail(input: SendOrderConfirmationEmailInput): Promise<SendOrderConfirmationEmailOutput> {
   // Check if AI is configured before attempting to run the flow
   if (!isAiConfigured) {
       console.warn("Attempted to call sendOrderConfirmationEmailFlow, but AI is not configured (GOOGLE_GENAI_API_KEY missing or invalid). Email generation will be skipped.");
       // Skip email generation but log the attempt to send
       console.log(`--- Skipping Email Generation (AI Not Configured) ---`);
       console.log(`To: ${input.recipientEmail}`);
       console.log(`Order for: ${input.userName}`);
       console.log(`Total: Rs. ${input.totalAmount}`);
       console.log(`--- Would have sent (Simulated) ---`);
       // Return success=true because the main order process might succeed, but indicate email wasn't sent
       return { success: true, message: 'Order placed, but confirmation email generation skipped (AI not configured).' };
   }
  return sendOrderConfirmationEmailFlow(input);
}

// Define the prompt for generating the email content
const emailPrompt = ai.definePrompt({
  name: 'orderConfirmationEmailPrompt',
  input: {
    schema: SendOrderConfirmationEmailInputSchema,
  },
  output: {
    // Outputting structured email content (subject and body)
    schema: z.object({
       subject: z.string().describe("The subject line for the order confirmation email."),
       body: z.string().describe("The HTML body content for the order confirmation email.")
    })
  },
  prompt: `Generate an order confirmation email for Bhattarai Kirana Pasal.

Recipient Name: {{{userName}}}
{{#if userEmail}}Customer Email: {{{userEmail}}}{{/if}}
Recipient Address (for internal use): {{{recipientEmail}}}

Order Details:
{{#each orderItems}}
- {{{name}}} (Quantity: {{{quantity}}}, Price: Rs. {{{price}}})
{{/each}}

Subtotal: Rs. {{{subtotal}}}
Shipping: Rs. {{{shippingCost}}}
Total: Rs. {{{totalAmount}}}

Payment Method: {{{paymentMethod}}}

Shipping Address:
{{{shippingAddress.name}}}
{{{shippingAddress.address}}}
{{{shippingAddress.city}}}, {{{shippingAddress.province}}} {{{shippingAddress.postalCode}}}
Nepal
Phone: {{{shippingAddress.phoneNumber}}}

Generate a friendly and professional email.
The subject should be something like "Your Bhattarai Kirana Pasal Order Confirmation".
The body should be HTML formatted, thanking the customer, summarizing the order, and providing the shipping details.
Mention that the order will be shipped soon.
`,
});

// Define the flow to generate and (theoretically) send the email
const sendOrderConfirmationEmailFlow = ai.defineFlow<
  typeof SendOrderConfirmationEmailInputSchema,
  typeof SendOrderConfirmationEmailOutputSchema
>(
  {
    name: 'sendOrderConfirmationEmailFlow',
    inputSchema: SendOrderConfirmationEmailInputSchema,
    outputSchema: SendOrderConfirmationEmailOutputSchema,
  },
  async (input) => {
    try {
      ensureAiIsConfigured(); // Double-check AI config within the flow
      // 1. Generate the email content using the prompt
      const { output } = await emailPrompt(input);

      if (!output || !output.subject || !output.body) {
        console.error("Failed to generate email content.");
        return { success: false, message: 'Failed to generate email content.' };
      }

      const { subject, body } = output;
      const recipient = input.recipientEmail;

      // 2. Simulate sending the email
      // In a real application, you would integrate with an email service provider (e.g., SendGrid, Mailgun, AWS SES) here.
      // Replace this console log with the actual email sending logic.
      console.log(`--- Sending Email ---`);
      console.log(`To: ${recipient}`);
      console.log(`Subject: ${subject}`);
      console.log(`Body (HTML):\n${body}`);
      console.log(`--- Email Sent (Simulated) ---`);

      // Simulate a successful send for now
      await new Promise(resolve => setTimeout(resolve, 100)); // Simulate network delay

      return { success: true, message: 'Email sent successfully (simulated).' };

    } catch (error) {
      console.error('Error in sendOrderConfirmationEmailFlow:', error);
       if (error instanceof Error && /API key not valid/i.test(error.message)) {
           return { success: false, message: 'Failed to generate email: Invalid API Key. Please check server configuration.' };
       }
        if (error instanceof Error && /AI features are not configured/i.test(error.message)) {
           return { success: false, message: 'Failed to generate email: AI service is not configured.' };
       }
      return { success: false, message: error instanceof Error ? error.message : 'An unknown error occurred while sending the email.' };
    }
  }
);

// IMPORTANT: Genkit itself doesn't directly send emails.
// This flow generates the email content. You'll need to add code
// using a library like Nodemailer and an email service provider (like SendGrid, etc.)
// to actually send the email generated in the `body` variable.
// The console.log above simulates this step.

