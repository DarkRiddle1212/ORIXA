from backend.app.decision_center.schemas import RiskAssessment

class RiskEngine:
    @staticmethod
    def evaluate_risk(investigation_id: str) -> RiskAssessment:
        if investigation_id == "silent-schema-disaster":
            return RiskAssessment(
                if_accepted="Normal analytical reports and billing ETL schedules are preserved. Column 'customer_phone_raw' is aligned to 'customer_phone' and encrypted, satisfying CCPA policies and re-establishing system schema balance.",
                if_ignored="The weekly Snowflake analytical report runs fail on Monday morning. The looker dashboard will fail to load with column mismatch error, disrupting regional executive summaries. Compliance fines may be levied under GDPR Article 30.",
                severity="HIGH",
                downstream_impact="14 datasets, 2 executive dashboards, and 4.2M processed transaction records."
            )
        elif investigation_id == "compromised-dev-keys-leak":
            return RiskAssessment(
                if_accepted="Vault tokens are immediately revoked and rotated, staging subnets are isolated, and security baseline integrity is restored, preventing any unauthorized resource access.",
                if_ignored="Malicious actors could use the leaked token to gain access to other staging databases, steal internal user data, or disrupt running sandbox microservices.",
                severity="CRITICAL",
                downstream_impact="All staging databases, active Vault secrets, and container workloads on Eastern subnet."
            )
        else:
            return RiskAssessment(
                if_accepted="Vulnerable plain-text tax identifiers are securely masked using column-level encryption views, satisfying financial audit standards.",
                if_ignored="Internal ledger databases remain in non-compliance, risking failure of upcoming SOX financial audits and exposing raw user PII.",
                severity="HIGH",
                downstream_impact="3 active financial reporting dashboards, corporate SOX certification status, and 140K accounts."
            )
