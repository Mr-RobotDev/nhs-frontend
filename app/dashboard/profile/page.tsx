import ProfileView from "@/components/Dashboard/ProfileView";
import { cookies } from 'next/headers'

export async function generateMetadata(props: any) {
  const { id } = props.params;
  const cookieStore = cookies()
  const token = cookieStore.get('token')

  const response = await fetch(`https://api.nhs.originsmartcontrols.com/v1/users/me`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token?.value}`
    }
  });

  const data = await response.json();

  const { firstName, lastName } = data.user
  const title = `${firstName} ${lastName} - Profile`;

  return {
    title: title,
  };
}
const ProfilePage = () => {
  return <ProfileView />;
};

export default ProfilePage;
