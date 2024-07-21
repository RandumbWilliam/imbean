import useGetConversations from "../hooks/useGetConversations";

const Home = () => {
  const { loading, conversations } = useGetConversations();

  return (
    <div>
      <p>Conversations</p>
      {loading ? <p>Loading</p> : null}
      {!loading &&
        conversations.map((conversation) => (
          <div>{JSON.stringify(conversation)}</div>
        ))}
    </div>
  );
};

export default Home;
