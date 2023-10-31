// todo: first make call for student report
// generate first report
// when timer is done
import { useForm } from "@mantine/form";
import {
  OOOEnum,
  OOOValues,
  SRSModel,
  defaultSRSObj,
  generateLearningSet,
} from "@/@types/srs.model";
import { Button, Center, Input, Text } from "@mantine/core";
import { useState } from "react";

export const PracticeSRS = () => {
  // short hand getting for answer input
  const answer = () => {
    return form.getInputProps("answer");
  };

  // form to manage user answer
  const form = useForm({
    initialValues: {
      answer: "",
    },
  });

  const [counter, setCounter] = useState(0);

  // TODO pull in the user has a previous report otherwise use default
  const [sRSObj, setSRSObj] = useState(defaultSRSObj);

  const generatedLearningSet = generateLearningSet(
    sRSObj.OOO,
    sRSObj.currentSection
  );
  const [learningSet, setLearningSet] = useState(generatedLearningSet);

  const checkSet = () => {
    if (counter === learningSet.length - 1) {
      // prepare to test or review wrong
      if (sRSObj.wrong.length) {
        // move the items in wrong to the learning stack
        setLearningSet(sRSObj.wrong);
        // check if user has gone through their 3rd iteration and set testing to true
        sRSObj.iterations < 3
          ? setSRSObj({ ...sRSObj, iterations: sRSObj.iterations++ })
          : setSRSObj({
              ...sRSObj,
              iterations: sRSObj.iterations++,
              testing: true,
            });
      } else {
        // The user is ready to be tested
        setSRSObj({ ...sRSObj, testing: true });
      }
      setCounter(0);
    } else {
      setCounter(counter + 1);
    }

    console.log(sRSObj);
  };

  const solve = (mathProblem: OOOValues) => {
    if (mathProblem.solution == answer().value) {
      setSRSObj({ ...sRSObj, right: [...sRSObj.right, mathProblem] });
      setSRSObj({
        ...sRSObj,
        wrong: [
          ...sRSObj.wrong.filter((val) => val.problem !== mathProblem.problem),
        ],
      });
    } else {
      setSRSObj({ ...sRSObj, wrong: [...sRSObj.wrong, mathProblem] });
    }

    form.reset();
    checkSet();
  };

  const startQuiz = () => {
    // shuffle set
    let shuffleArr = generatedLearningSet;
    for (let i = shuffleArr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffleArr[i], shuffleArr[j]] = [shuffleArr[j], shuffleArr[i]];
    }

    setLearningSet(shuffleArr);
    // set it back to default but get user currentsection
    let currentSection = 1;
    setSRSObj({ ...defaultSRSObj, currentSection });
  };

  return (
    <Center>
      <Text size={"120px"}>
        {learningSet[counter].problem}
        <Input type="number" {...form.getInputProps("answer")} />
      </Text>
      <Button disabled={!sRSObj.testing} onClick={() => startQuiz()}>
        Start Quiz
      </Button>
      <Button
        disabled={!form.getInputProps("answer").value}
        onClick={() => solve(learningSet[counter])}
      >
        Next
      </Button>
    </Center>
  );
};
