import styled from 'styled-components';
import { shade } from 'polished';

export const Calendar = styled.aside`
  width: 100%;
  .DayPicker {
    border-radius: 10px;
  }
  .DayPicker-wrapper {
    padding-bottom: 0;
    background: #3e3b47;
    border-radius: 10px;
  }
  .DayPicker,
  .DayPicker-Month {
    width: 100%;
  }
  .DayPicker-NavButton {
    color: #999591 !important;
  }
  .DayPicker-NavButton--prev {
    right: auto;
    left: 1rem;
    margin-right: 0;
  }
  .DayPicker-Month {
    border-collapse: separate;
    border-spacing: 0.5rem;
    margin: 1rem 0 0 0;
    padding: 0.25rem;
    background-color: #28262e;
    border-radius: 0 0 1rem 1rem;
  }
  .DayPicker-Caption {
    margin-bottom: 1rem;
    padding: 0 1rem;
    color: #f4ede8;
    > div {
      text-align: center;
    }
  }
  .DayPicker-Day {
    width: 40px;
    height: 40px;
  }
  .DayPicker-Day--available:not(.DayPicker-Day--outside) {
    background: #3e3b47;
    border-radius: 0.25rem;
    color: #fff;
  }
  .DayPicker:not(.DayPicker--interactionDisabled)
    .DayPicker-Day:not(.DayPicker-Day--disabled):not(.DayPicker-Day--selected):not(.DayPicker-Day--outside):hover {
    background: ${shade(0.2, '#3e3b47')};
  }
  .DayPicker-Day--today {
    font-weight: normal;
  }
  .DayPicker-Day--disabled {
    color: #666360 !important;
    background: transparent !important;
  }
  .DayPicker-Day--selected {
    background: #ff9000 !important;
    border-radius: 0.25rem;
    color: #232129 !important;
  }
`;
