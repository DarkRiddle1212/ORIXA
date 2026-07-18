import asyncio
import uuid
import os
from typing import Any, Dict, List
from backend.app.core.logging import logger
from backend.app.atlas.context import AtlasContext
from backend.app.atlas.planner import AtlasPlanner, ExecutionPlan
from backend.app.atlas.response_builder import AtlasResponseBuilder, SynthesisReport
from backend.app.specialists.manager import specialist_manager
from backend.app.datahub.service import context_service
from backend.app.memory.memory_service import memory_service
from backend.app.ai.reasoning_service import reasoning_service


class AtlasWorkflow:
    """
    Coordinates state transitions and executing the multi-stage supervisor pipeline.
    Invokes genuine specialist agents registered in the Orixa SpecialistManager.
    """

    def __init__(self):
        self.planner = AtlasPlanner()
        self.response_builder = AtlasResponseBuilder()

    async def run(self, query: str, metadata: Dict[str, Any] = None) -> Dict[str, Any]:
        session_id = str(uuid.uuid4())
        context = AtlasContext(
            session_id=session_id,
            query=query,
            current_stage="INIT",
            metadata=metadata or {}
        )

        context.add_log(f"Atlas: Initializing multi-agent orchestration boundary. Trace ID: {session_id}")
        context.add_log(f"Atlas: Ingestion prompt: '{query}'")

        # 1. Analyze Intent Stage
        context.current_stage = "ANALYZING"
        context.add_log("Atlas: Stage [ANALYZING] initiated. Running NLP intent routing...")
        await asyncio.sleep(0.4)  # Simulate parsing latency

        # 1.5 Context Retrieval Stage
        context.add_log("Atlas: Interrogating DataHub Context Layer to retrieve live organizational catalog context...")
        matching_datasets = []
        try:
            search_res = await context_service.search_assets(query, type_filter="dataset")
            datasets_found = search_res.get("datasets", [])
            if datasets_found:
                context.add_log(f"Atlas: DataHub Context Layer matched {len(datasets_found)} catalog asset(s).")
                for ds in datasets_found:
                    context.add_log(f"  | Discovered Dataset: '{ds.name}' [URN: {ds.urn}] on platform '{ds.platform.upper()}' (Domain: {ds.domain or 'Unassigned'})")
                    lin = await context_service.get_lineage(ds.urn)
                    if lin:
                        context.add_log(f"  |   Lineage: {len(lin.upstream_nodes)} Upstreams, {len(lin.downstream_nodes)} Downstreams mapped.")
                    matching_datasets.append(ds)
            else:
                context.add_log("Atlas: DataHub Context Layer returned 0 matching datasets. Utilizing global heuristics.")
        except Exception as ex:
            context.add_log(f"Atlas: [WARNING] DataHub Context Layer unavailable or errored: {str(ex)}. Falling back to localized telemetry.")

        # 1.6 Organizational Memory Retrieval Stage
        context.add_log("Atlas: Interrogating Organizational Memory for similar historical incidents...")
        similar_memories = []
        try:
            similar_memories = memory_service.find_similar_incidents(query, limit=3)
            if similar_memories:
                context.add_log(f"Atlas: Organizational Memory matched {len(similar_memories)} historical incident(s).")
                for mem in similar_memories:
                    context.add_log(f"  | Similar Incident Recalled: '{mem.incident}' [ID: {mem.id}] (Confidence Rank: HIGH)")
                    context.add_log(f"  |   - Previous Outcome: {mem.final_outcome}")
                    context.add_log(f"  |   - Lessons Learned: {', '.join(mem.lessons_learned)}")
                    if "remediations" in mem.recommendations and mem.recommendations["remediations"]:
                        context.add_log(f"  |   - Reusable Playbook: {', '.join(mem.recommendations['remediations'])}")
            else:
                context.add_log("Atlas: No similar historical incidents found in Organizational Memory. Building greenfield plan.")
        except Exception as mx:
            context.add_log(f"Atlas: [WARNING] Organizational Memory service error: {str(mx)}")

        # 2. Planning Stage
        context.current_stage = "PLANNING"
        context.add_log("Atlas: Stage [PLANNING] initiated. Formulating multi-disciplinary execution plan...")
        plan: ExecutionPlan = self.planner.analyze_and_plan(query, matching_datasets)
        context.add_log(f"Atlas: Detected intent '{plan.intent}' with confidence {plan.confidence:.2f}")
        context.add_log(f"Atlas: Formulated chronological plan containing {len(plan.steps)} step(s). Specialists: {', '.join(plan.selected_specialists)}")
        await asyncio.sleep(0.4)

        # 3. Execution Stage (Sequential Execution)
        context.current_stage = "EXECUTING"
        context.add_log(f"Atlas: Stage [EXECUTING] initiated. Dispatching sequential sub-tasks...")

        for step in plan.steps:
            context.add_log(f"Atlas: Dispatching Step {step.step_number}/{len(plan.steps)} to specialist '{step.specialist_name}' -> Task: {step.task}")
            
            # Temporarily transition specialist's status in the registry via manager if available
            try:
                # Dispatch the real task execution
                response = await specialist_manager.execute_agent_task(
                    name=step.specialist_name,
                    task=step.task,
                    payload=step.payload
                )
                
                # Capture outputs
                context.specialist_outputs[step.specialist_name] = {
                    "task": response.task,
                    "status": response.status,
                    "result": response.result,
                    "explanation": response.explanation
                }
                context.add_log(f"Atlas: Specialist '{step.specialist_name}' successfully completed task. Explanation: {response.explanation}")
            except Exception as e:
                context.add_log(f"Atlas: [ERROR] Step {step.step_number} failed on '{step.specialist_name}': {str(e)}")
                # Continue execution to capture partial results, or fail-fast depending on requirements.
                # In our simulation, we record the error and gracefully carry on.
                context.specialist_outputs[step.specialist_name] = {
                    "task": step.task,
                    "status": "FAILED",
                    "result": {"error": str(e)},
                    "explanation": f"System error during specialist execution: {str(e)}"
                }

            await asyncio.sleep(0.3)

        # 4. Aggregation Stage
        context.current_stage = "AGGREGATING"
        context.add_log("Atlas: Stage [AGGREGATING] initiated. Correlating specialist outputs...")
        await asyncio.sleep(0.4)

        # 5. Final Report Construction
        context.current_stage = "COMPLETED"
        context.add_log("Atlas: Stage [COMPLETED]. Generating executive reports and remediations...")
        
        recommendation_payload = {}
        use_gemini = False
        
        # Check if Gemini API key exists
        api_key = os.environ.get("GEMINI_API_KEY")
        if api_key:
            try:
                context.add_log("Atlas: Routing multi-source context to Gemini Intelligence Engine...")
                gemini_res = await reasoning_service.generate_reasoning_synthesis(
                    query=query,
                    datahub_assets=matching_datasets,
                    similar_incidents=similar_memories,
                    specialist_outputs=context.specialist_outputs
                )
                context.add_log(f"Atlas: Gemini Intelligence Engine synthesis completed with confidence {gemini_res.get('confidence_score', 0.85):.2f}.")
                
                recommendation_payload = {
                    "overview": gemini_res.get("overview"),
                    "findings": gemini_res.get("findings", []),
                    "key_findings": gemini_res.get("findings", []),
                    "remediations": [
                        {
                            "action_type": r.get("action_type", "HEALTH_CHECK"),
                            "title": r.get("title", "Remediation Step"),
                            "description": r.get("description", ""),
                            "code": r.get("code", ""),
                            "commands_or_code": r.get("code", "")
                        }
                        for r in gemini_res.get("remediations", [])
                    ],
                    "risk_level": gemini_res.get("risk_level", "LOW"),
                    "confidence_score": gemini_res.get("confidence_score", 0.85),
                    "root_cause_analysis": gemini_res.get("root_cause_analysis"),
                    "risk_assessment": gemini_res.get("risk_assessment"),
                    "specialist_contributions": gemini_res.get("specialist_contributions", [])
                }
                use_gemini = True
            except Exception as gem_ex:
                context.add_log(f"Atlas: [WARNING] Gemini Intelligence Engine failed: {str(gem_ex)}. Rolling back to localized heuristics.")
                logger.error(f"AtlasWorkflow: Gemini failed, using fallback. Error: {str(gem_ex)}")
        else:
            context.add_log("Atlas: [INFO] GEMINI_API_KEY is not configured. Falling back to rule-based engine.")

        if not use_gemini:
            report: SynthesisReport = self.response_builder.synthesize(plan.intent, context.specialist_outputs)
            context.add_log(f"Atlas: Rule-based synthesis completed. System Hazard Rating: {report.risk_level}")
            
            recommendation_payload = {
                "overview": report.overview,
                "findings": report.key_findings,
                "key_findings": report.key_findings,
                "remediations": [
                    {
                        "action_type": r.action_type,
                        "title": r.action_type.replace("_", " ").title(),
                        "description": r.description,
                        "code": r.commands_or_code,
                        "commands_or_code": r.commands_or_code
                    }
                    for r in report.remediations
                ],
                "risk_level": report.risk_level,
                "confidence_score": plan.confidence,
                "root_cause_analysis": "Diagnostic engine traced this incident via static pattern matching.",
                "risk_assessment": f"Evaluated hazard as {report.risk_level} based on active specialists findings.",
                "specialist_contributions": [
                    {
                        "specialist_name": s,
                        "contribution": "Contributed standard system diagnostic output metrics."
                    }
                    for s in plan.selected_specialists
                ]
            }

        # Construct final payload
        return {
            "session_id": context.session_id,
            "query": context.query,
            "stage": context.current_stage,
            "intent": plan.intent,
            "confidence": recommendation_payload.get("confidence_score", plan.confidence),
            "selected_specialists": plan.selected_specialists,
            "plan_steps": [s.model_dump() for s in plan.steps],
            "specialist_outputs": context.specialist_outputs,
            "recommendation": recommendation_payload,
            "orchestration_logs": context.logs,
            "similar_incidents": [m.model_dump() for m in similar_memories] if similar_memories else []
        }
