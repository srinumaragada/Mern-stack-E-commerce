import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import CommonForm from '@/commonForm';
import { registerFormControls } from '@/config';
import { useDispatch } from 'react-redux';
import { registerUserAction } from '@/store/AuthSlice';
import { useToast } from '@/hooks/use-toast';

function Register() {
  const [formData, setFormData] = useState({
    userName: "", // Use userName
    email: "",
    password: ""
  });
  
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  function onSubmit(event) {
    event.preventDefault();
    dispatch(registerUserAction(formData)).then((data) => {
        if (data?.payload?.success) {
            toast({
                title: "You Registered Successfully", // Success message
            });
            navigate("/auth/login"); // Navigate to login after successful registration
        } else {
            toast({
                title: data?.payload?.message || "Registration failed", // Display error message if available
                variant: "destructive", // Show error variant
            });
        }
    }).catch((error) => {
        // This handles unexpected errors
        toast({
            title: error.message || "An unexpected error occurred", // Display unexpected error
            variant: "destructive",
        });
    });
}


  return (
    <div className="mx-auto w-full max-w-md space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold tracking-tight text-foreground">
          Create new account
        </h1>
        <p className="mt-2">
          Already have an account
          <Link
            className="font-medium ml-2 text-primary hover:underline"
            to="/auth/login"
          >
            Login
          </Link>
        </p>
      </div>
      <CommonForm
        formControls={registerFormControls}
        buttonText={"Sign Up"}
        formData={formData}
        setFormData={setFormData}
        onSubmit={onSubmit}
      />
    </div>
  );
}

export default Register;
