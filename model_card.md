# AI Ethics & Reflection Model Card

### 1. What are the limitations or biases in your system?
The primary limitation is the strictness of the retrieval system's keyword matching. If a client asks about a "bouncy castle" instead of a "bounce house," the system might fail to trigger the correct logic if it isn't explicitly programmed. It has a bias toward exact terminology found in the `RENTAL_KNOWLEDGE_BASE`.

### 2. Could your AI be misused, and how would you prevent that?
In an equipment rental business, an AI hallucinating policies (like telling a client that delivery is free for a single chair, or that they will get a full refund an hour before the event) could result in financial loss or customer service disputes. To prevent this, the system uses a strict confidence scorer that triggers a fallback response if the AI cannot explicitly ground its answer in the approved knowledge base.

### 3. What surprised you while testing your AI's reliability?
I was surprised by how effectively a simple confidence scoring function could map out system reliability. By explicitly checking if the output relied on the retrieved context, I was able to programmatically catch out-of-scope requests (like the bounce house query) and prevent hallucinations.

### 4. Collaboration with AI
* **Helpful Instance:** The AI was highly effective in structuring the mock database and writing the boilerplate logic for the confidence scorer, allowing me to focus on the system architecture.
* **Flawed Instance:** Initially, the AI misunderstood the nature of my "Rentability" app, assuming it was for real estate property management rather than event equipment scheduling. This required a pivot to rewrite the database and logic to match the correct party rental domain.