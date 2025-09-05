import Header from "@components/Header";

const Feedback = () => {
  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100vh" }}>
      <Header title="피드백 하기" isBackButton={true} />
      <iframe
        src="https://docs.google.com/forms/d/e/1FAIpQLSfVe9QV5QPlKfGtAth6hsDJI-o96k7N1Xg1f-5KX3M7kFddmQ/viewform?usp=dialog"
        style={{ flex: 1, border: "none" }}
        title="피드백 폼"
      />
    </div>
  );
};

export default Feedback;
