import users


def mailing_list(user_ids):
    out = []
    for uid in user_ids:
        found = users.get_user(uid)
        if found is not None:
            _, email = found
            out.append(email)
    return out
