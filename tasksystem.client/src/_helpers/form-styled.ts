import styled from "styled-components";
import { themes } from ".";

const theme = themes[0];

export const FormStyled = styled.form`
  > h1 {
    font-size: clamp(1.2rem, 5vw, 1.6rem);
    font-weight: 600;
  }

  color: ${() => theme.colorGrey1};

  .form-control {
    position: relative;
    display:flex;
    margin: 1.6rem 0;
    font-weight: 500;
    align-content: flex-start;
    flex-wrap: wrap;

    @media screen and (max-width: 450px) {
      margin: 1rem 0;
    }

    label {
      margin-bottom: 0.5rem;
      display: inline-block;
      font-size: clamp(0.9rem, 5vw, 1.2rem);

      span {
        color: ${() => theme.colorGrey3};
      }
    }

    input,
    textarea,
    select {
      width: 100%;
      padding: 1rem;

      resize: none;
      background-color: ${() => theme.colorGreyDark};
      color: ${() => theme.colorGrey2};
      border-radius: 0.5rem;
    }
  }

  .submit-btn {
    background: ${() => theme.colorGreenDark};
    color: ${() => theme.colorWhite} ;
    transition: all 0.35s ease-in-out;
    font-size: 1.5rem;
    border-radius:10px;
    border:none;

    i {
      color: ${() => theme.colorGrey0};
    }

    @media screen and (max-width: 500px) {
      font-size: 0.9rem !important;
      padding: 0.6rem 1rem !important;

      i {
        font-size: 1.2rem !important;
        margin-right: 0.5rem !important;
      }
    }
  }

  .submit-btn:hover {
    background: ${() => theme.colorPrimaryGreen} !important;
      color: ${() => theme.colorWhite} !important;
  }

.switch {
  position: relative;
  display: inline-block;
  width: 60px;
  height: 34px;
  margin-left:1rem;
}

.switch input { 
  opacity: 0;
  width: 0;
  height: 0;
}

.slider {
  position: absolute;
  cursor: pointer;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: #ccc;
  -webkit-transition: .4s;
  transition: .4s;
}

.slider:before {
  position: absolute;
  content: "";
  height: 26px;
  width: 26px;
  left: 4px;
  bottom: 4px;
  background-color: white;
  -webkit-transition: .4s;
  transition: .4s;
}

input:checked + .slider {
  background-color: #2196F3;
}

input:focus + .slider {
  box-shadow: 0 0 1px #2196F3;
}

input:checked + .slider:before {
  -webkit-transform: translateX(26px);
  -ms-transform: translateX(26px);
  transform: translateX(26px);
}

.slider.round {
  border-radius: 34px;
}

.slider.round:before {
  border-radius: 50%;
}
`;