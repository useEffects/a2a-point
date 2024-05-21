import userStore from "app/store/user";
import Profile from "app/components/profile";

export default function ProfileScreen() {
    const { user } = userStore()
    return user && Object.keys(user).length ? <Profile user={user} /> : <></>
}