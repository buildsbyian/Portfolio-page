Software Architecture Case Study

\# NutriPal: Agentic Architecture

A multi-agent nutrition tracking system that accurately interprets natural language, resolves complex recipes, and validates dietary data to eliminate LLM hallucinations.



`AI AGENTS` `SYSTEM ARCHITECTURE` `LLM ORCHESTRATION`



\---



\### The Problem

Nutrition tracking is often high-friction and prone to errors. Traditional apps struggle with complex, real-world inputs—like pasted recipes with vague quantities, raw vs. cooked ingredient confusion, or tricky unit conversions. On the other hand, simple LLM-based trackers often hallucinate nutritional data or make silent, incorrect assumptions, causing users to lose trust and eventually abandon logging altogether.



\### What I Built

I designed a robust, multi-agent system architecture for a nutrition tracking app to make food logging reliable and frictionless. Instead of relying on a single prompt, the system routes user input (via a Natural Language Chat Agent) through a central Orchestrator to highly specialized agents:



\* \*\*Intent \& Recipe Agents:\*\* Parse natural language to extract portions, detect whether a food is branded or homemade, and match inputs against a user's saved recipes.

\* \*\*Nutrition Agent:\*\* Queries structured data from authoritative, verified databases (USDA FoodData Central and Open Food Facts), normalizes units, and calculates batch vs. portion macros.

\* \*\*Validator Agent:\*\* Cross-checks data sources and performs logical sanity checks to catch implausible calories, disproportionate ingredients, or incorrect matches. 

\* \*\*Insight Agent:\*\* Runs asynchronously to update daily goals and correlate logs with Apple Health data without blocking the user's workflow.



\### Concrete Outcome

Defined a highly scalable system design that minimizes logging friction while maximizing data trust. By strictly separating tasks into specialized agents—ensuring the system parses, queries, and validates in distinct, isolated steps—the architecture gracefully handles edge cases and effectively eliminates hallucinated nutrition data. 



\### My Role

Architected the multi-agent workflow and defined the specific responsibilities, inputs, and outputs for each agent. Mapped out complex execution paths for different use cases (e.g., logging a brand-new recipe vs. recalling a saved one) and conducted a comprehensive system risk assessment to identify and mitigate edge cases like ambiguous portions and double-counting.



\### Resources \& Links

Supporting artifacts, files, and external references related to this project.





\* \*\*View GitHub Repo\*\* https://github.com/buildsbyian/AI-nutritional-assistant

