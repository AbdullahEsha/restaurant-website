import { Step, StepLabel, Stepper, makeStyles } from "@material-ui/core";
import React from "react";

// Step for checkout
export default function CheckWizard({ activeStep = 0 }) {
  const useStyles = makeStyles(() => ({
    root: {
      "& .MuiStepIcon-active": { color: "red" },
      "& .MuiStepIcon-completed": { color: "green" },
      "& .Mui-disabled .MuiStepIcon-root": { color: "cyan" },
    },
  }));
  const c = useStyles();
  return (
    <Stepper activeStep={activeStep} className={c.root} alternativeLabel>
      {["Login", "Shipping Address", "Payment Method", "Place Order"].map(
        (step) => (
          <Step key={step}>
            <StepLabel>{step}</StepLabel>
          </Step>
        )
      )}
    </Stepper>
  );
}
