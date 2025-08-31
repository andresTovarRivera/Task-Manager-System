import styled from "styled-components";
import { themes } from ".";

const theme = themes[0];

export const DivStyled = styled.div`
  padding: 1.2rem 1rem;
  border-radius: 1rem;
  background-color: ${() => theme.borderColor2};
  box-shadow: ${() => theme.shadow7};
  border: 2px solid ${() => theme.borderColor2};

  height: 16rem;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;

  .date {
    margin-top: auto;
  }

  > h1 {
    font-size: 1.5rem;
    font-weight: 600;
  }

  .task-header{
    display: flex;
    justify-content: space-between;
  }
 
  .task-title{
    overflow: hidden; 
    white-space: nowrap; 
    text-overflow: ellipsis; 
    margin:0;
  }
  .task-description{
    overflow-y: auto;    
    overflow-wrap: break-word;
    margin-bottom:2px;
  }
  
  .task-drag-icon{
    font-size:x-large;
    margin:0;
    cursor:grab;
  }

  .priority-icon{
    display: contents;
    font-size:math;
    margin:0;
   
  }

  .priority-icon.high{
    color: ${() => theme.colorDanger};
  }

  .priority-icon.medium{
    color: ${() => theme.colorYellow};
  }

  .priority-icon.low{
    color: ${() => theme.colorGreenLight};
  }

  .priority-icon.none{
    display:none;
  }

  .task-footer {
    display: flex;
    align-items: center;
    gap: 1.2rem;
    justify-content: space-between;

    button {
      border: none;
      outline: none;
      cursor: pointer;
      background:none;

      i {
        font-size: 1.4rem;
        color: ${() => theme.colorGrey2};
      }
    }

    .edit {
      margin-left: auto;
    }

    .completed,
    .incomplete {
      display: inline-block;
      padding: 0.4rem 1rem;
      background: ${() => theme.colorDanger};
      border-radius: 30px;
    }

    .completed {
      background: ${() => theme.colorGreenDark} !important;
    }


  }
`;