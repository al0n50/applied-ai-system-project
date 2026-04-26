import logging

# 1. Setup Logging
logging.basicConfig(filename='rentability_ai_logs.log', level=logging.INFO, 
                    format='%(asctime)s - %(levelname)s - %(message)s')

# 2. Mock Database for RAG
# Simulates the database for a party rental business (e.g., Ascend LLC equipment policies)
RENTAL_KNOWLEDGE_BASE = {
    "cleaning_popcorn": "Commercial popcorn machines must be wiped down with a damp cloth after use. Do NOT submerge the kettle in water, as this will short the electrical components. A $50 cleaning fee applies if returned uncleaned.",
    "chair_delivery": "For orders of 40 or more commercial plastic folding chairs, curbside delivery is included for free within a 15-mile radius. Setup and breakdown require an additional $30 service fee.",
    "cancellation_policy": "Cancellations made 48 hours before the event date receive a full refund. Cancellations within 48 hours forfeit the 20% scheduling deposit."
}

def retrieve_policy_data(query):
    """RAG Step 1: Retrieve relevant rental policy context."""
    logging.info(f"Retrieving context for query: '{query}'")
    
    query_lower = query.lower()
    retrieved_context = []
    
    if "popcorn" in query_lower or "clean" in query_lower or "machine" in query_lower:
        retrieved_context.append(RENTAL_KNOWLEDGE_BASE["cleaning_popcorn"])
    if "chair" in query_lower or "delivery" in query_lower or "setup" in query_lower:
        retrieved_context.append(RENTAL_KNOWLEDGE_BASE["chair_delivery"])
    if "cancel" in query_lower or "refund" in query_lower or "deposit" in query_lower:
        retrieved_context.append(RENTAL_KNOWLEDGE_BASE["cancellation_policy"])
        
    if not retrieved_context:
        logging.warning("No context found in database for the given query.")
        return None
    
    return " | ".join(retrieved_context)

def generate_ai_response(query, context):
    """Simulates an AI generating a response grounded ONLY in retrieved context."""
    if context:
        return f"Based on Rentability equipment guidelines: {context}"
    return "I cannot find a specific policy regarding that equipment or service. Please contact the rental manager directly."

def confidence_scorer(response, context):
    """Reliability Testing: Scores output to prevent hallucinations."""
    score = 0.0
    if context and "Based on Rentability equipment guidelines" in response:
        score = 0.95 # High confidence: successfully used RAG
    elif not context and "contact the rental manager directly" in response:
        score = 0.85 # Handled missing data safely
    else:
        score = 0.20 # Failure/Hallucination risk
        logging.error(f"Low confidence score generated. Risk of hallucination.")
    
    logging.info(f"System Confidence Score: {score}")
    return score

def main():
    print("🎪 Welcome to the Rentability Equipment AI Agent 🎪")
    print("-" * 50)
    
    # 3. Automated Testing
    test_queries = [
        "How do I clean the popcorn machine before I return it?",
        "Do you deliver the plastic folding chairs?",
        "Can I rent a bounce house for next Tuesday?" # Should safely fail
    ]
    
    for query in test_queries:
        print(f"\nClient Query: {query}")
        
        context = retrieve_policy_data(query)
        response = generate_ai_response(query, context)
        confidence = confidence_scorer(response, context)
        
        print(f"AI Response: {response}")
        print(f"Reliability Score: {confidence}")
        print("-" * 50)

if __name__ == "__main__":
    main()