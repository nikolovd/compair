from compair.core import celery, db
from compair.models import User

@celery.task(bind=True, ignore_result=True)
def set_passwords(self, user_passwords):
    user_ids = user_passwords.keys()

    users = User.query \
        .filter(User.id.in_(user_ids)) \
        .all()

    for user in users:
        user.password = user_passwords.get(user.id, None)

    db.session.add_all(users)
    db.session.commit()