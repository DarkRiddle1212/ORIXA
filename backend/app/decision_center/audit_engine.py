from typing import List
from datetime import datetime, timedelta
from backend.app.decision_center.schemas import AuditEntry

class AuditEngine:
    @staticmethod
    def generate_trail(investigation_id: str) -> List[AuditEntry]:
        base_time = datetime.now() - timedelta(minutes=15)
        
        if investigation_id == "silent-schema-disaster":
            return [
                AuditEntry(
                    id="aud-rec-init",
                    timestamp=(base_time).strftime("%H:%M:%S UTC"),
                    action="INVESTIGATION_DISPATCHED",
                    performed_by="atlas-supervisor@orixa.enterprise.ai",
                    details="Atlas initiated diagnostic boundary scan following alert trigger #SD-2914."
                ),
                AuditEntry(
                    id="aud-dh-sync",
                    timestamp=(base_time + timedelta(minutes=2)).strftime("%H:%M:%S UTC"),
                    action="METADATA_SYNCHRONIZED",
                    performed_by="datahub-ingest@orixa.enterprise.ai",
                    details="Successfully synchronized physical sandbox schemas against DataHub catalog registry."
                ),
                AuditEntry(
                    id="aud-spec-run",
                    timestamp=(base_time + timedelta(minutes=5)).strftime("%H:%M:%S UTC"),
                    action="SPECIALIST_ENGAGED",
                    performed_by="architect-topology@orixa.enterprise.ai",
                    details="Specialist 'Architect' mapped downstream lineage and quantified looker report dependencies."
                ),
                AuditEntry(
                    id="aud-risk-calc",
                    timestamp=(base_time + timedelta(minutes=8)).strftime("%H:%M:%S UTC"),
                    action="RISK_EVALUATED",
                    performed_by="oracle-prediction@orixa.enterprise.ai",
                    details="Oracle computed 84.5% breaking probability index for Monday morning ETL processing runs."
                ),
                AuditEntry(
                    id="aud-rec-compiled",
                    timestamp=(base_time + timedelta(minutes=12)).strftime("%H:%M:%S UTC"),
                    action="RECOMMENDATION_COMPILED",
                    performed_by="atlas-supervisor@orixa.enterprise.ai",
                    details="Remediation migration script compiled. Ready for operator decision verification."
                )
            ]
        elif investigation_id == "compromised-dev-keys-leak":
            return [
                AuditEntry(
                    id="aud-th-init",
                    timestamp=(base_time).strftime("%H:%M:%S UTC"),
                    action="THREAT_SCAN_DISPATCHED",
                    performed_by="sentinel-threat-spec@orixa.enterprise.ai",
                    details="Sentinel triggered an automated high-priority threat audit after checking git branch logs."
                ),
                AuditEntry(
                    id="aud-key-id",
                    timestamp=(base_time + timedelta(minutes=3)).strftime("%H:%M:%S UTC"),
                    action="CREDENTIAL_EXPOSURE_FLAGGED",
                    performed_by="archivist-knowledge-spec@orixa.enterprise.ai",
                    details="Archivist identified plain text Vault token inside committed branch configuration file."
                ),
                AuditEntry(
                    id="aud-sub-isolate",
                    timestamp=(base_time + timedelta(minutes=7)).strftime("%H:%M:%S UTC"),
                    action="CONTAINMENT_EVALUATED",
                    performed_by="sentinel-threat-spec@orixa.enterprise.ai",
                    details="Calculated safe network subnet routing isolation instructions."
                ),
                AuditEntry(
                    id="aud-rec-threat",
                    timestamp=(base_time + timedelta(minutes=11)).strftime("%H:%M:%S UTC"),
                    action="RECOMMENDATION_COMPILED",
                    performed_by="atlas-supervisor@orixa.enterprise.ai",
                    details="Key rotation script generated. Awaiting manual administrative approval."
                )
            ]
        else:
            return [
                AuditEntry(
                    id="aud-pii-init",
                    timestamp=(base_time).strftime("%H:%M:%S UTC"),
                    action="COMPLIANCE_SWEEP",
                    performed_by="guardian-privacy-spec@orixa.enterprise.ai",
                    details="Guardian initiated scheduled data dictionary review on reporting schemas."
                ),
                AuditEntry(
                    id="aud-pii-flag",
                    timestamp=(base_time + timedelta(minutes=4)).strftime("%H:%M:%S UTC"),
                    action="UNENCRYPTED_PII_FLAGGED",
                    performed_by="guardian-privacy-spec@orixa.enterprise.ai",
                    details="Isolated plain column 'tax_id_unencrypted' storing cleartext SSN variables."
                ),
                AuditEntry(
                    id="aud-rec-pii",
                    timestamp=(base_time + timedelta(minutes=10)).strftime("%H:%M:%S UTC"),
                    action="RECOMMENDATION_COMPILED",
                    performed_by="atlas-supervisor@orixa.enterprise.ai",
                    details="DDL masking view compiled. Sent to compliance supervisor dashboard."
                )
            ]
