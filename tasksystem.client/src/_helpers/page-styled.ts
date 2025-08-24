import styled from "styled-components";
import { themes } from "../_helpers";

const theme = themes[0];

export const PageStyled = styled.main`
  position: relative;
  padding: 2rem;
  background-color: ${() => theme.colorBg2};
  border: 2px solid ${() => theme.borderColor2};
  border-radius: 1rem;
  height: 100%;

  overflow-y: auto;

  &::-webkit-scrollbar {
    width: 0.5rem;
  }

  .home-header{
    display: flex;
    justify-content: space-between;
  }

  .home-title{
   margin:0;
  }

  .btn-rounded {
    width: 3rem;
    height: 3rem;
    border-radius: 50%;

    background-color: ${() => theme.colorBg};
    border: 2px solid ${() => theme.colorGreenDark};
    box-shadow: 0 3px 15px rgba(0, 0, 0, 0.3);
    color: ${() => theme.colorGrey2};
    font-size: 1.4rem;

    display: flex;
    align-items: center;
    justify-content: center;

    @media screen and (max-width: 768px) {
      width: 2rem;
      height: 2rem;
    }
  }

  .filter-tasks{
    font-size: 2.3rem;
    border-radius: 0.5rem;
    background: ${() => theme.borderColor2};
    color: ${() => theme.colorPrimaryGreen};
  }

  .filter-tasks-option{
    background: ${() => theme.borderColor2};
  }

  .tasks {
    margin: 2rem 0;
  }

  > h1 {
    font-size: clamp(1.5rem, 2vw, 2rem);
    font-weight: 800;
    position: relative;

    &::after {
      content: "";
      position: absolute;
      bottom: -0.5rem;
      left: 0;
      width: 3rem;
      height: 0.2rem;
      background-color: ${() => theme.colorPrimaryGreen};
      border-radius: 0.5rem;
    }      
  }

  .create-task {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.5rem;

    height: 16rem;
    color: ${() => theme.colorGrey2};
    font-weight: 600;
    cursor: pointer;
    border-radius: 1rem;
    border: 3px dashed ${() => theme.colorGrey5};
    transition: all 0.3s ease;

    i {
      font-size: 1.5rem;
      margin-right: 0.2rem;
    }

    &:hover {
      background-color: ${() => theme.colorGrey5};
      color: ${() => theme.colorGrey0};
    }
  }
`;