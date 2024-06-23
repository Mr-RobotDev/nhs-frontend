import SingleAlert from '@/components/Dashboard/alerts/SingleAlert';

export const metadata = {
  title: 'Edit - Alert'
}

const SingleAlertPage = ({ params }: { params: { id: string } }) => {
  const { id } = params;

  return (
    <div>
      {id && <SingleAlert id={id} />}
    </div>
  );
};

export default SingleAlertPage;
