from typing import Tuple

class SummaryEngine:
    @staticmethod
    def compile_summaries(investigation_id: str) -> Tuple[str, str, str]:
        """
        Returns (executive_summary, final_recommendation, atlas_summary)
        """
        if investigation_id == "silent-schema-disaster":
            executive_summary = (
                "A physical database schema modification on users_sandbox introduced "
                "an incompatible column layout that deviates from production schemas, "
                "threatening downstream billing pipelines and Tableau analytics."
            )
            final_recommendation = (
                "Rename customer_phone_raw to customer_phone and apply column-level "
                "encryption via SHA-256 update before running the morning analytics loader."
            )
            atlas_summary = (
                "OPERATIONAL BRIEFING: Atlas detected structural column drift on table "
                "'users_sandbox' at 09:14 UTC. Analysis of downstream lineage via DataHub "
                "pinpoints 14 affected datasets and 2 critical Looker dashboards. Under "
                "CCPA regulation CC-5, unencrypted phone contact logs pose significant legal "
                "risks. Consensus between specialists (Atlas, Oracle, Forge) is 100%. "
                "Recommendation: Apply database migration patch DDL-2942 to sync and secure fields."
            )
        elif investigation_id == "compromised-dev-keys-leak":
            executive_summary = (
                "A plaintext Vault credentials key was committed to staging branch "
                "config files and identified in active logs from an unauthorized IP block, "
                "violating security perimeter policies."
            )
            final_recommendation = (
                "Revoke compromised Vault staging token, restrict subnet ingress rules, "
                "and rotate authorization headers for Eastern clusters."
            )
            atlas_summary = (
                "SECURITY ALERT: Unencrypted staging credentials identified inside git commit "
                "history on branch sandbox-patch-99. Active logging confirms lateral connection "
                "attempts from unauthorized developer subnets. Sentinel threat engine recommends "
                "immediate isolation of container staging instances. Recommendation: Run Vault "
                "rotation command SEC-RO-42 and isolate Staging Sandbox Delta environment."
            )
        else:
            executive_summary = (
                "An unmasked table column storing raw customer Social Security numbers "
                "was located in analytic reporting tables, failing SOX compliance standards."
            )
            final_recommendation = (
                "Establish masked view layer over column 'tax_id_unencrypted' and restrict "
                "direct query privileges on analytic master datasets."
            )
            atlas_summary = (
                "COMPLIANCE REPORT: Automated dictionary scan flagged high-entropy plain SSN "
                "records inside table 'finance_reporting'. This is a direct SOX compliance infraction. "
                "Guardian recommends establishing a masked view layer over sensitive attributes to "
                "re-establish financial data isolation. Recommendation: Deploy view patch MASK-VIEW-82."
            )
        return executive_summary, final_recommendation, atlas_summary
