# **App Name**: Nyay Sahayak

## Core Features:

- User Authentication: Secure user sign-up and login using Firebase Authentication (Email/Password & Google Sign-In).
- AI Legal Chatbot (Indian Law): An AI chatbot grounded strictly in Indian Law, referencing the Constitution, specific Acts (e.g., IPC, CrPC, Contract Act), and verifiable Supreme Court/High Court Judgments. Responses must contain tool.
- Legal Disclaimer: A clear, non-negotiable legal disclaimer stating: 'This is an AI legal assistant, NOT a substitute for a human lawyer or formal legal advice. Use for informational purposes only.'
- User Dashboard: A dashboard view showing the user's recent legal queries.
- Chat Interface: A clean, persistent chat window where users can ask questions.
- Structured Query Output: AI responses provide a Simple Answer, a list of Relevant Indian Legal Sections/Acts, and, if applicable, the Next General Step in the Indian legal system (e.g., 'File an FIR' or 'Issue a Legal Notice').
- Chat History Storage: Store user profiles and chat history in Cloud Firestore.

## Style Guidelines:

- The concept of "justice helper" calls to mind trust, reliability, and a connection to the local community. A light color scheme evokes transparency, and in this case we'll choose hues associated with clarity. Primary color: Light sky blue (#87CEEB) to represent clarity and approachability.
- Background color: Very light blue (#F0F8FF) to create a calm and trustworthy environment.
- Accent color: Muted blue-green (#70A1AF) to add a touch of sophistication without overwhelming the user.
- Body and headline font: 'PT Sans', sans-serif, which is accessible and easy to read for users seeking legal help. Using it for both heading and body keeps things simple, clean, and less intimidating for a user base potentially stressed when engaging the app.
- Use clear and universally recognized icons to represent legal concepts and actions. Icons should be simple and easily understandable, ensuring accessibility for all users.
- Implement a clean, responsive layout that adapts to different screen sizes. Prioritize accessibility with large text and sufficient contrast to ensure readability for all users.
- Use subtle animations to provide feedback on user interactions and guide them through the app. Animations should be used sparingly to avoid overwhelming users seeking legal assistance.