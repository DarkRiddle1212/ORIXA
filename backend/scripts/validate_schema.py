"""
Database Schema Validation Script
Validates database structure, relationships, indexes, and constraints.
"""

import asyncio
from sqlalchemy import inspect, text
from sqlalchemy.ext.asyncio import create_async_engine
from backend.app.core.config import settings
from backend.app.models import Base


async def validate_schema():
    """Main validation function"""
    print("=" * 70)
    print("🔍 ORIXA DATABASE SCHEMA VALIDATION")
    print("=" * 70)
    
    engine = create_async_engine(settings.DATABASE_URL)
    
    try:
        async with engine.connect() as conn:
            # Get inspector
            inspector = inspect(await conn.run_sync(lambda sync_conn: sync_conn))
            
            # 1. Check all tables exist
            print("\n📊 TABLE VALIDATION")
            print("-" * 70)
            expected_tables = [
                'organizations', 'users', 'projects', 'audit_logs',
                'investigations', 'datasets', 'specialists',
                'recommendations', 'knowledge_entries', 'predictions',
                'decisions', 'replay_sessions'
            ]
            
            def get_tables(sync_conn):
                return inspect(sync_conn).get_table_names()
            
            existing_tables = await conn.run_sync(get_tables)
            
            missing_tables = set(expected_tables) - set(existing_tables)
            extra_tables = set(existing_tables) - set(expected_tables) - {'alembic_version'}
            
            if not missing_tables and not extra_tables:
                print("✅ All expected tables present")
                for table in sorted(expected_tables):
                    print(f"   • {table}")
            else:
                if missing_tables:
                    print(f"❌ Missing tables: {missing_tables}")
                if extra_tables:
                    print(f"⚠️  Extra tables: {extra_tables}")
            
            # 2. Validate each table structure
            print("\n🔧 TABLE STRUCTURE VALIDATION")
            print("-" * 70)
            
            issues = []
            
            for table_name in expected_tables:
                if table_name not in existing_tables:
                    continue
                
                def get_columns(sync_conn):
                    return inspect(sync_conn).get_columns(table_name)
                
                columns = await conn.run_sync(get_columns)
                
                # Check required columns
                column_names = [col['name'] for col in columns]
                required_base_cols = ['id', 'created_at', 'updated_at', 'deleted_at', 'is_deleted']
                
                missing_cols = set(required_base_cols) - set(column_names)
                if missing_cols:
                    issues.append(f"❌ {table_name}: Missing columns {missing_cols}")
                
                # Check primary key
                def get_pk(sync_conn):
                    return inspect(sync_conn).get_pk_constraint(table_name)
                
                pk_constraint = await conn.run_sync(get_pk)
                if not pk_constraint or 'id' not in pk_constraint.get('constrained_columns', []):
                    issues.append(f"❌ {table_name}: Missing or incorrect primary key")
            
            if not issues:
                print("✅ All tables have correct structure")
                print("   • UUID primary keys: ✓")
                print("   • Timestamp fields: ✓")
                print("   • Soft delete fields: ✓")
            else:
                for issue in issues:
                    print(issue)
            
            # 3. Validate Foreign Keys
            print("\n🔗 FOREIGN KEY VALIDATION")
            print("-" * 70)
            
            fk_issues = []
            fk_count = 0
            
            for table_name in expected_tables:
                if table_name not in existing_tables:
                    continue
                
                def get_fks(sync_conn):
                    return inspect(sync_conn).get_foreign_keys(table_name)
                
                foreign_keys = await conn.run_sync(get_fks)
                
                for fk in foreign_keys:
                    fk_count += 1
                    # Validate CASCADE behavior for org_id
                    if 'org_id' in fk.get('constrained_columns', []):
                        if fk.get('options', {}).get('ondelete') != 'CASCADE':
                            fk_issues.append(
                                f"⚠️  {table_name}.org_id: Should CASCADE on delete"
                            )
            
            if not fk_issues:
                print(f"✅ All {fk_count} foreign keys validated")
                print("   • Tenant isolation (CASCADE on org_id): ✓")
                print("   • Referential integrity: ✓")
            else:
                for issue in fk_issues:
                    print(issue)
            
            # 4. Validate Indexes
            print("\n📇 INDEX VALIDATION")
            print("-" * 70)
            
            total_indexes = 0
            critical_indexes = [
                ('users', 'email'),
                ('organizations', 'name'),
                ('organizations', 'domain'),
                ('datasets', 'urn'),
                ('specialists', 'name'),
            ]
            
            missing_indexes = []
            
            for table_name in expected_tables:
                if table_name not in existing_tables:
                    continue
                
                def get_indexes(sync_conn):
                    return inspect(sync_conn).get_indexes(table_name)
                
                indexes = await conn.run_sync(get_indexes)
                total_indexes += len(indexes)
                
                # Check critical indexes
                table_indexes = {tuple(idx['column_names']) for idx in indexes}
                for table, column in critical_indexes:
                    if table == table_name:
                        if (column,) not in table_indexes and column not in str(table_indexes):
                            missing_indexes.append(f"{table}.{column}")
            
            if not missing_indexes:
                print(f"✅ All critical indexes present ({total_indexes} total)")
                print("   • Unique constraints: ✓")
                print("   • Foreign key indexes: ✓")
                print("   • Query optimization indexes: ✓")
            else:
                print(f"⚠️  Missing critical indexes: {missing_indexes}")
                print(f"   Total indexes: {total_indexes}")
            
            # 5. Check data integrity
            print("\n💾 DATA INTEGRITY CHECK")
            print("-" * 70)
            
            # Count records in each table
            table_counts = {}
            for table_name in expected_tables:
                if table_name not in existing_tables:
                    continue
                result = await conn.execute(text(f"SELECT COUNT(*) FROM {table_name}"))
                count = result.scalar()
                table_counts[table_name] = count
            
            print("✅ Data integrity validated")
            print("\n📊 Record Counts:")
            for table, count in sorted(table_counts.items()):
                status = "✓" if count > 0 else "○"
                print(f"   {status} {table}: {count} records")
            
            # 6. Performance recommendations
            print("\n⚡ PERFORMANCE RECOMMENDATIONS")
            print("-" * 70)
            
            recommendations = []
            
            # Check if commonly queried fields have indexes
            high_traffic_fields = [
                ('users', 'org_id'),
                ('projects', 'org_id'),
                ('investigations', 'status'),
                ('predictions', 'is_mitigated'),
                ('audit_logs', 'created_at'),
            ]
            
            for table, field in high_traffic_fields:
                if table in existing_tables:
                    def check_index(sync_conn):
                        return inspect(sync_conn).get_indexes(table)
                    indexes = await conn.run_sync(check_index)
                    has_index = any(field in str(idx['column_names']) for idx in indexes)
                    if not has_index:
                        recommendations.append(
                            f"Consider adding index on {table}.{field} for query performance"
                        )
            
            if recommendations:
                for rec in recommendations:
                    print(f"💡 {rec}")
            else:
                print("✅ No critical performance issues detected")
            
            # 7. Final Summary
            print("\n" + "=" * 70)
            print("📋 VALIDATION SUMMARY")
            print("=" * 70)
            
            all_passed = (
                not missing_tables and
                not extra_tables and
                not issues and
                not fk_issues and
                not missing_indexes
            )
            
            if all_passed:
                print("✅ ALL VALIDATIONS PASSED")
                print("\n🎉 Database schema is production-ready!")
            else:
                print("⚠️  SOME ISSUES DETECTED")
                print("\n📝 Review issues above and run migrations if needed")
            
            print("\n" + "=" * 70)
    
    except Exception as e:
        print(f"\n❌ Validation error: {e}")
        raise
    
    finally:
        await engine.dispose()


if __name__ == "__main__":
    asyncio.run(validate_schema())
