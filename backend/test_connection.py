"""
Script de test pour vérifier la connexion à PostgreSQL
"""
import sys
from app.core.database import engine, SessionLocal
from sqlalchemy import text
from app.models import CloudInstance

def test_connection():
    """Tester la connexion à la base de données"""
    print("🔍 Test de connexion à PostgreSQL...")
    
    try:
        # Test 1: Connexion basique
        print("\n1️⃣ Test de connexion basique...")
        with engine.connect() as conn:
            result = conn.execute(text("SELECT version()"))
            version = result.fetchone()[0]
            print(f"   ✅ Connexion réussie!")
            print(f"   📊 Version PostgreSQL: {version.split(',')[0]}")
        
        # Test 2: Vérifier les tables
        print("\n2️⃣ Vérification des tables...")
        with engine.connect() as conn:
            result = conn.execute(text("""
                SELECT table_name 
                FROM information_schema.tables 
                WHERE table_schema = 'public'
            """))
            tables = [row[0] for row in result.fetchall()]
            print(f"   ✅ Tables trouvées: {', '.join(tables)}")
        
        # Test 3: Test avec SQLAlchemy ORM
        print("\n3️⃣ Test avec SQLAlchemy ORM...")
        db = SessionLocal()
        try:
            count = db.query(CloudInstance).count()
            print(f"   ✅ ORM fonctionne! Nombre d'instances: {count}")
        finally:
            db.close()
        
        # Test 4: Requête de test
        print("\n4️⃣ Test de requête...")
        db = SessionLocal()
        try:
            instances = db.query(CloudInstance).limit(3).all()
            if instances:
                print(f"   ✅ Données trouvées:")
                for instance in instances:
                    print(f"      - {instance.name} ({instance.provider})")
            else:
                print("   ⚠️  Aucune donnée trouvée (normal si la base est vide)")
        finally:
            db.close()
        
        print("\n✅ Tous les tests sont passés!")
        return True
        
    except Exception as e:
        print(f"\n❌ Erreur de connexion: {e}")
        print("\n💡 Vérifications:")
        print("   1. PostgreSQL est-il démarré?")
        print("   2. Les credentials sont-ils corrects?")
        print("   3. La base de données 'cloud_db' existe-t-elle?")
        return False

if __name__ == "__main__":
    success = test_connection()
    sys.exit(0 if success else 1)

