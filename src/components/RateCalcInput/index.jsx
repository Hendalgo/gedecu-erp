import { useRef } from "react";
import DecimalInput from "../DecimalInput";
import "./RateCalcInput.css";
import { formatAmount } from "../../utils/amount";

export default function RateCalcInput({
  message = "",
  defaultValue = 0,
  disableButton = false,
  onClick = () => null,
  onChange = () => null,
}) {
  const svgRef = useRef();
  const handleButton = () => {
    onClick();
    svgRef.current.classList.toggle("rotate");
  }
  defaultValue = formatAmount(defaultValue);
  return (
    <>
      <div className="input-group">
        <button type="button" onClick={handleButton} disabled={disableButton} tabIndex={-1} className="btn btn-secondary z-0">
          <svg className="CalcRateSvg" ref={svgRef} width="20" height="20" viewBox="0 0 52 52" fill="none" xmlns="http://www.w3.org/2000/svg">
            <g id="Group 104">
              <path id="Vector" d="M25.2499 31.6368C24.5874 31.5808 23.9231 31.5312 23.2616 31.4639C22.9372 31.4312 22.9199 31.2957 23.0903 31.0041C23.6598 30.0255 24.1883 29.0208 24.7423 28.0329C24.9446 27.6721 25.1834 27.3319 25.3957 26.9758C25.6035 26.6263 25.7301 26.2721 25.3428 25.9506C25.2836 25.9188 25.2235 25.887 25.1642 25.8543C25.1342 25.8206 25.1032 25.7879 25.0731 25.7543C24.9164 25.7477 24.7596 25.7403 24.6038 25.7337C24.3669 25.7337 24.13 25.7337 23.8931 25.7328C23.7445 25.7132 23.5969 25.6758 23.4484 25.6758C19.2193 25.7234 14.9729 25.573 10.753 25.7328C10.5161 25.7328 10.2801 25.7328 10.0431 25.7337C9.8855 25.7375 9.72786 25.7412 9.5693 25.7449C9.51098 25.7823 9.45175 25.8197 9.39344 25.8571C9.35152 25.8692 9.30869 25.8823 9.26677 25.8945L9.24308 25.9085C9.17929 25.9851 9.11551 26.0627 9.05172 26.1394C8.88588 26.8142 9.32145 27.3366 9.50916 27.9133C9.7552 28.6666 10.1097 29.3835 10.4095 30.1181C12.0779 34.2286 13.7592 38.3335 15.4076 42.4524C15.5279 42.7496 15.7238 42.9234 16.0673 42.8795C16.3699 42.8403 16.553 42.7141 16.6997 42.4075C17.4069 41.0215 18.2498 39.7046 18.9751 38.326C19.0972 38.097 19.2239 37.9727 19.4918 38.0045C19.8608 38.0484 20.2326 38.0624 20.6035 38.0895C20.6946 38.0877 20.7857 38.0867 20.8778 38.0849C20.9735 38.1204 21.0691 38.1877 21.1648 38.1877C22.2683 38.1951 23.3718 38.1942 24.4753 38.1905C24.5236 38.1905 24.571 38.1381 24.6184 38.1092C24.9519 38.0764 25.2854 38.0437 25.6189 38.011C29.1755 37.5717 32.856 36.8455 35.9724 34.9557C37.1871 34.2033 38.3508 33.3444 39.4515 32.4257C40.3209 31.6995 41.0198 30.7779 41.5766 29.761C41.7242 29.4909 41.8736 29.219 42.0531 28.9713C42.2764 28.6638 42.5206 28.6984 42.6409 29.0619C43.3854 31.3181 42.927 33.7042 41.829 35.7614C39.9773 39.1438 36.6431 41.285 33.2178 42.6954C31.5812 43.3636 29.8817 43.7936 28.1695 44.1394C26.9165 44.3917 25.6199 44.4104 24.3423 44.5329C23.5851 44.5076 22.8278 44.4749 22.0697 44.4609C21.8528 44.4572 21.6359 44.5086 21.4181 44.5347C19.7806 44.388 18.1286 44.259 16.543 43.7898C13.0557 42.7001 9.66681 40.771 7.61561 37.5764C6.19408 35.4249 5.78584 33.3781 6.09931 30.8172C7.17821 25.1533 12.786 21.9765 17.8415 20.7073C19.5036 20.3493 21.1557 20.1577 22.8442 19.9577C22.9053 19.9914 23 19.9381 23.0611 19.9717C24.4298 19.9661 25.7994 19.9942 27.1681 19.9596C27.826 20.0306 28.483 20.1016 29.191 20.1783C28.4237 21.5597 27.7011 22.8429 26.9986 24.1383C26.8145 24.4785 26.6924 24.8542 26.542 25.2141C26.6213 25.3571 26.7015 25.5001 26.7808 25.6431L26.7908 25.6459C26.8154 25.6776 26.84 25.7104 26.8637 25.7421C26.933 25.7552 27.0022 25.7674 27.0715 25.7805C27.2883 25.7898 27.5052 25.7982 27.7221 25.8076C27.897 25.8076 28.0711 25.8076 28.246 25.8076C28.3946 25.8272 28.5431 25.8636 28.6907 25.8636C32.9216 25.8169 37.1689 25.9646 41.3907 25.8076C41.4745 25.8076 41.5574 25.8076 41.6412 25.8076C41.9511 25.8019 42.2609 25.7963 42.5707 25.7907C42.6299 25.7533 42.6901 25.7169 42.7493 25.6795C42.8441 25.5879 42.9389 25.4963 43.0336 25.4047C42.9944 25.0477 43.0309 24.6589 42.9033 24.3402C42.3137 22.8663 41.6631 21.4185 41.0644 19.9493C40.4512 18.4436 39.8835 16.9183 39.2757 15.4107C38.4182 13.3489 37.5188 11.304 36.7443 9.20666C36.6331 8.90945 36.5055 8.68514 36.1766 8.66271C35.8531 8.64028 35.6207 8.7515 35.4494 9.07394C34.7085 10.4572 33.9185 11.8124 33.1704 13.1919C32.8013 13.8443 32.2272 13.6237 31.5365 13.5443C31.4153 13.5144 31.295 13.4854 31.1739 13.4555C29.7159 13.4536 28.257 13.4508 26.799 13.4508C24.1218 13.8106 21.4555 14.3219 18.9068 15.2547C16.1758 16.2865 13.5496 17.923 11.6323 20.196C11.0883 20.8578 10.6837 21.64 10.1971 22.3541C10.0823 22.5223 9.8855 22.7504 9.73059 22.7466C9.46816 22.741 9.40437 22.484 9.37977 22.2008C9.33329 21.6597 9.17656 21.1297 9.12735 20.5886C8.8394 15.6313 12.8826 11.7535 16.9075 9.73005C20.177 8.11221 23.8074 7.20655 27.4341 7.06355C28.4174 7.06916 29.4015 7.07664 30.3847 7.07571C30.4977 7.07571 30.6107 7.02617 30.7237 7C31.2176 7.08786 31.7106 7.23366 32.2072 7.25142C33.9158 7.31217 35.5332 7.77668 37.1233 8.36176C37.814 8.61598 38.5048 8.8973 39.1499 9.25246C41.89 10.7226 44.457 12.9209 45.5131 16.0005C45.5605 16.1528 45.6662 16.2855 45.7446 16.4267C45.7491 16.5192 45.7345 16.6183 45.7619 16.7043C46.2567 18.2838 46.2075 19.8736 45.8612 21.4699C44.3996 26.7254 39.2347 29.4704 34.4552 30.8733C32.764 31.3256 31.008 31.5424 29.2639 31.663C29.1081 31.6303 28.9513 31.5705 28.7955 31.5686C27.7585 31.5593 26.7215 31.5593 25.6846 31.5639C25.5397 31.5639 25.3957 31.6116 25.2508 31.6368H25.2499Z" fill="white"/>
            </g>
          </svg>
        </button>
        <DecimalInput defaultValue={defaultValue} name="rate" id="rate" onChange={onChange} />
      </div>
      <small className="fst-italic">{message}</small>
    </>
  );
}