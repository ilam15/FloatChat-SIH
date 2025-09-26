from Database.db_connection import engine, Base, User, get_db
from sqlalchemy.orm import Session

# Test database connection
try:
    with engine.connect() as conn:
        print("Database connection successful!")
        # Create tables if not exist
        Base.metadata.create_all(bind=engine)
        print("Tables created successfully!")
except Exception as e:
    print(f"Database connection failed: {e}")
    exit(1)

# Test user operations
db: Session = next(get_db())
try:
    # Create a test user
    test_user = User(email="test@example.com", password="testpass")
    db.add(test_user)
    db.commit()
    db.refresh(test_user)
    print(f"Test user created: {test_user.email}")

    # Get user by email
    user = db.query(User).filter(User.email == "test@example.com").first()
    if user:
        print(f"User retrieved: {user.email}")
    else:
        print("User not found")

    # Delete test user
    db.delete(user)
    db.commit()
    print("Test user deleted")

except Exception as e:
    print(f"User operation failed: {e}")
    db.rollback()
finally:
    db.close()
