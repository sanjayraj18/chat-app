import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { socket } from "./socket";

function App() {
  const queryClient = useQueryClient();
  const [input, setInput] = useState("");

  const my_id = "ankith_2";
  const friend_id = "sanjay_1";

  const { data: messages = [], isLoading } = useQuery({
    queryKey: ["messages", my_id, friend_id],
    queryFn: async () => {
      const res = await fetch(
        `http://localhost:3000/api/messages?userA=${my_id}&userB=${friend_id}`,
      );

      return res.json();
    },
  });

  const mutation = useMutation({
    mutationFn: async (newMessage: string) => {
      const res = await fetch("http://localhost:3000/api/messages/direct", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          senderId: my_id,
          receiverId: friend_id,
          message: newMessage,
        }),
      });

      return res.json();
    },
    onSuccess: (data) => {
      queryClient.setQueryData(["messages", my_id, friend_id], (old: any) => [
        ...old,
        data,
      ]);
      setInput("");
    },
  });

  useEffect(() => {
    socket.connect();
    socket.emit("join_chat", `user_${my_id}`);

    socket.on("new_message", (data) => {
      queryClient.setQueryData(["messages", my_id, friend_id], (old: any) => [
        ...old,
        data,
      ]);
    });

    return () => {
      socket.off("new_message");
      socket.disconnect();
    };
  }, [queryClient, my_id, friend_id]);

  const handleSend = () => {
    if (!input) {
      return;
    }

    mutation.mutate(input);
  };

  if (isLoading) return <div>Loading messages...</div>;

  return (
    <div style={{ padding: "20px" }}>
      <h2>Chat App (React Query + Sockets)</h2>
      <div
        style={{
          border: "1px solid #ccc",
          height: "300px",
          overflowY: "auto",
          marginBottom: "10px",
        }}
      >
        {messages.map((m: any, index: number) => (
          <div key={m.id || index} style={{ margin: "5px" }}>
            <strong>{m.senderId === my_id ? "Me" : "Friend"}:</strong>{" "}
            {m.message}
          </div>
        ))}
        {mutation.isPending && <div style={{ color: "gray" }}>Sending...</div>}
      </div>
      <input
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyPress={(e) => e.key === "Enter" && handleSend()}
      />
      <button onClick={handleSend} disabled={mutation.isPending}>
        Send
      </button>
    </div>
  );
}

export default App;
