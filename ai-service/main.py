import os
import json
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from dotenv import load_dotenv

load_dotenv()

app = FastAPI(title="AI Learning Companion Service")

class SolveRequest(BaseModel):
    question: str
    difficulty: str = "medium"
    user_level: str = "beginner"

class FollowupRequest(BaseModel):
    topic: str
    difficulty: str = "medium"

class AnalyzeRequest(BaseModel):
    user_answer: str
    correct_answer: str

def get_llm_response(prompt: str) -> dict:
    GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
    if not GEMINI_API_KEY or GEMINI_API_KEY == 'your_gemini_pro_api_key_here':
        # Mock logic based on input prompt identifiers
        if "Explain step-by-step" in prompt:
            return {
                "steps": ["Read the problem carefully.", "Identify the variables.", "Apply the formula.", "Calculate the result."],
                "final_answer": "42",
                "topic": "Algebra",
                "follow_up": "Solve for x: 3x + 5 = 14"
            }
        elif "similar but slightly harder" in prompt:
            return {
                "question": "Solve for x: 5x - 7 = 18",
                "difficulty": "medium",
                "topic": "Algebra"
            }
        elif "student's answer" in prompt.lower():
            return {
                "is_correct": False,
                "explanation": "You forgot to carry the 1 during the addition step, or failed to isolate the variable properly.",
                "conceptual_gap": "Basic arithmetic carrying / isolating variables"
            }
        return {"error": "Mock logic missed prompt signature."}
    
    # Real LLM Implementation
    try:
        import google.generativeai as genai
        genai.configure(api_key=GEMINI_API_KEY)
        model = genai.GenerativeModel('gemini-2.5-flash')
        response = model.generate_content(prompt)
        text = response.text.replace('```json', '').replace('```', '').strip()
        return json.loads(text)
    except Exception as e:
        print("LLM Error:", e)
        return {"error": str(e)}

@app.post("/solve")
async def solve_problem(req: SolveRequest):
    prompt = f"""
    Explain step-by-step for a {req.user_level} student. Return STRICT JSON response with keys:
    - steps: array of strings
    - final_answer: string
    - topic: string
    - follow_up: string containing a follow-up question
    
    Problem: {req.question}
    Difficulty: {req.difficulty}
    """
    
    result = get_llm_response(prompt)
    if "error" in result:
        raise HTTPException(status_code=500, detail=result["error"])
    return result

@app.post("/followup")
async def generate_followup(req: FollowupRequest):
    prompt = f"""
    Generate a similar but slightly harder/easier problem about {req.topic}. Return STRICT JSON format with keys:
    - question: string
    - difficulty: string
    - topic: string
    
    Target difficulty: {req.difficulty}
    """
    
    result = get_llm_response(prompt)
    if "error" in result:
        raise HTTPException(status_code=500, detail=result["error"])
    return result

@app.post("/analyze")
async def analyze_mistake(req: AnalyzeRequest):
    prompt = f"""
    Compare the student's answer: "{req.user_answer}" against the correct answer: "{req.correct_answer}".
    If it's wrong, Explain why the student's answer is wrong and identify the concept gap. 
    Return STRICT JSON response with keys:
    - is_correct: boolean
    - explanation: string (why it is correct or incorrect)
    - conceptual_gap: string (what concept they misunderstood, or "None" if correct)
    """
    
    result = get_llm_response(prompt)
    if "error" in result:
        raise HTTPException(status_code=500, detail=result["error"])
    return result
