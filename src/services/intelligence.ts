import { GoogleGenAI, Type } from "@google/genai";
import { IntelligenceReport, UserRole } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export async function generateIntelligence(
  newsInputs: string[],
  userRole: UserRole,
  userContext?: string
): Promise<IntelligenceReport> {
  const model = "gemini-3-flash-preview";
  
  const prompt = `
    ROLE: You are a multi-agent AI system (Event Extraction, Story Synthesis, Graph Engine, Personalization, Scenario Engine).
    OBJECTIVE: Transform the provided raw business news into a unified, interactive intelligence system.
    
    INPUT NEWS ARTICLES:
    ${newsInputs.map((n, i) => `ARTICLE ${i + 1}:\n${n}`).join('\n\n')}
    
    USER PROFILE:
    Role: ${userRole}
    Context: ${userContext || 'General business interest'}
    
    INSTRUCTIONS:
    1. EVENT EXTRACTION: Identify key events, entities, and timestamps.
    2. STORY SYNTHESIS: Build cause-effect chains. Detect conflicts and uncertainties.
    3. GRAPH ENGINE: Create an entity relationship graph.
    4. PERSONALIZATION: Highlight relevance to the user's role (${userRole}).
    5. SCENARIO ENGINE: Generate 3 scenarios (Likely, Risk, Opportunity).
    
    OUTPUT RULES:
    - No long paragraphs.
    - Structured, modular data.
    - Strict factual grounding.
    - Indicate uncertainty where applicable.
  `;

  const response = await ai.models.generateContent({
    model,
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          coreInsight: { type: Type.STRING },
          timeline: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                id: { type: Type.STRING },
                timestamp: { type: Type.STRING },
                title: { type: Type.STRING },
                description: { type: Type.STRING },
                impact: { type: Type.STRING, enum: ['high', 'medium', 'low'] }
              },
              required: ['id', 'timestamp', 'title', 'description', 'impact']
            }
          },
          causalChain: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                cause: { type: Type.STRING },
                effect: { type: Type.STRING },
                description: { type: Type.STRING }
              },
              required: ['cause', 'effect', 'description']
            }
          },
          entities: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                id: { type: Type.STRING },
                name: { type: Type.STRING },
                type: { type: Type.STRING, enum: ['company', 'person', 'sector', 'government', 'other'] },
                description: { type: Type.STRING }
              },
              required: ['id', 'name', 'type']
            }
          },
          relationships: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                source: { type: Type.STRING },
                target: { type: Type.STRING },
                type: { type: Type.STRING, enum: ['influence', 'dependency', 'competition', 'partnership', 'ownership'] },
                description: { type: Type.STRING }
              },
              required: ['source', 'target', 'type']
            }
          },
          personalizedInsight: { type: Type.STRING },
          scenarios: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                type: { type: Type.STRING, enum: ['likely', 'risk', 'opportunity'] },
                title: { type: Type.STRING },
                description: { type: Type.STRING },
                probability: { type: Type.NUMBER },
                triggers: { type: Type.ARRAY, items: { type: Type.STRING } }
              },
              required: ['type', 'title', 'description', 'probability', 'triggers']
            }
          },
          signals: { type: Type.ARRAY, items: { type: Type.STRING } },
          uncertainties: { type: Type.ARRAY, items: { type: Type.STRING } }
        },
        required: ['coreInsight', 'timeline', 'causalChain', 'entities', 'relationships', 'personalizedInsight', 'scenarios', 'signals', 'uncertainties']
      }
    }
  });

  return JSON.parse(response.text);
}
