import { ProfileScreen as ProfileScreenComponent } from "app/screens/profile";
import userStore from "app/store/user";

export default function ProfileScreen() {
    const { user, company, document } = userStore()
    return <ProfileScreenComponent user={user} company={company} document={document} />
}