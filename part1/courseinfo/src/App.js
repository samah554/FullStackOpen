const App = () => {
  const course = "Half Stack application development";
  const parts = [
    {
      name: "Fundamentals of React",
      exercises: 10,
    },
    {
      name: "Using props to pass data",
      exercises: 7,
    },
    {
      name: "State of a component",
      exercises: 14,
    },
  ];
  return (
    <div>
      <Header course={course} />
      <Content parts={parts} />
      <Total parts={parts} />
    </div>
  );
};

const Header = (props) => {
  return <h1>{props.course}</h1>;
};

const Content = (props) => {
  return (
    <div>
      <Part p1={props.parts[0].name} ex={props.parts[0].exercises} />
      <Part p1={props.parts[1].name} ex={props.parts[1].exercises} />
      <Part p1={props.parts[2].name} ex={props.parts[2].exercises} />
    </div>
  );
};

const Part = (props) => {
  return (
    <div>
      <p>
        {props.p1} {props.ex}
      </p>
    </div>
  );
};

const Total = (props) => {
  return (
    <div>
      <p>
        Number of Excercises =
        {props.parts[0].exercises +
          props.parts[1].exercises +
          props.parts[2].exercises}
      </p>
    </div>
  );
};

export default App;
