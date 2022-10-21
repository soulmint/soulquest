import React, { Fragment } from 'react';
import { shape, string } from 'prop-types';
import { useTranslation } from 'next-i18next';
// import defaultClasses from './claim.module.css';
// import { useStyle } from 'src/components/classify';
import { FaClock, FaDice } from 'react-icons/fa';

const Claim = (props) => {
  const { classes: propClasses, content } = props;
  // const classes = useStyle(defaultClasses, propClasses);

  const { t } = useTranslation('campaign_details');

  return (
    <Fragment>
      {/* Concept: Claim Box 1 / FCFS / Win */}
      <div className="card mb-6">
        <div className="card-header flex justify-between">
          <h3 className="">Claim your Rewards</h3>
          <div className="flex items-center shadow  text-slate-800 rounded-full py-1 px-2 text-sm font-bold ml-2">
            <FaClock className="text-lg mr-2" /> FCFS
          </div>
        </div>
        <div className="card-body">
          <div className="bg-slate-100 rounded-xl border-l-0 border-r-0 p-6 text-center">
            <div className="font-semibold">
              Congratulations! You win the Quest!
            </div>
            <div className="mt-4 inline-flex items-center">
              <img src="/symbols/usdc.svg" className="w-7 h-7 m-2" />
              <span className="text-3xl font-bold">500 USDC</span>
            </div>
          </div>
          <div className="mt-4">
            <button
              type="button"
              className="rounded-xl font-semibold bg-violet-600 text-white px-4 py-3 w-full hover:bg-violet-700 shadow"
            >
              Claim
            </button>
          </div>
        </div>
      </div>
      {/* End Concept: Claim Box 1 / FCFS / Win */}

      {/* Concept: Claim Box 1 / FCFS / Lose */}
      <div className="card mb-6">
        <div className="card-header flex justify-between">
          <h3 className="">Claim your Rewards</h3>
          <div className="flex items-center shadow  text-slate-800 rounded-full py-1 px-2 text-sm font-bold ml-2">
            <FaClock className="text-lg mr-2" /> FCFS
          </div>
        </div>
        <div className="card-body">
          <div className="bg-slate-100 rounded-xl border-l-0 border-r-0 p-6 text-center">
            <div className="font-semibold">You are not qualified</div>
            <div className="mt-4 inline-flex items-center">
              <img src="/symbols/usdc.svg" className="w-7 h-7 m-2" />
              <span className="text-3xl font-bold">500 USDC</span>
            </div>
          </div>
        </div>
      </div>
      {/* End Concept: Claim Box 1 / FCFS / Lose */}

      {/* Concept: Claim Box 2 / Lucky Draws / Countdown */}
      <div className="card mb-6">
        <div className="card-header flex justify-between">
          <h3 className="">Claim your Rewards</h3>
          <div className="flex items-center shadow  text-slate-800 rounded-full py-1 px-2 text-sm font-bold ml-2">
            <FaDice className="text-lg mr-2" /> Lucky Draw
          </div>
        </div>
        <div className="card-body">
          <div className="bg-slate-100 rounded-xl border-l-0 border-r-0 p-6 text-center">
            <div className="font-semibold">Lucky Draw in:</div>
            <div className="mt-8 flex items-center justify-center space-x-6">
              <div className="flex flex-col">
                <span className="text-3xl font-bold">2</span>
                <span className="text-sm">DAYS</span>
              </div>
              <div className="flex flex-col">
                <span className="text-3xl font-bold">18</span>
                <span className="text-sm">HOURS</span>
              </div>
              <div className="flex flex-col">
                <span className="text-3xl font-bold">05</span>
                <span className="text-sm">MINUTES</span>
              </div>
              <div className="flex flex-col">
                <span className="text-3xl font-bold">55</span>
                <span className="text-sm">SECONDS</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* End Concept: Claim Box 2 / Lucky Draws / Countdown */}

      {/* Concept: Winner Lists */}
      <div className="card mb-6">
        <div className="card-header flex justify-between">
          <h3 className="">Winners (5)</h3>
        </div>
        <div className="card-body">
          <div className="flex items-center text-sm space-x-4 mb-2">
            <div className="font-medium text-slate-400 w-1/12">No.</div>
            <div className="font-medium text-slate-400 text-left w-4/12">
              Time
            </div>
            <div className="text-right pr-2 font-medium text-slate-400 w-7/12">
              Soul Address
            </div>
          </div>
          <div className="flex items-center text-sm space-x-4 justify-between mb-2">
            <div className="font-medium text-slate-400 w-1/12">1</div>
            <div className="font-medium text-slate-400 text-left w-4/12">
              4PM, 20 Oct
            </div>
            <div className="text-right text-md w-7/12">
              <div
                title="0x58E78124fe7cc061E1A9c05118379E72f0ed0621"
                className="questers_questerAvt__Kes2f"
              >
                <span className="questers_souldAvatar__MEX_E">
                  <svg
                    viewBox="0 0 36 36"
                    fill="none"
                    role="img"
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                  >
                    <mask
                      id="mask__beam"
                      maskUnits="userSpaceOnUse"
                      x="0"
                      y="0"
                      width="36"
                      height="36"
                    >
                      <rect width="36" height="36" rx="72" fill="#FFFFFF" />
                    </mask>
                    <g mask="url(#mask__beam)">
                      <rect width="36" height="36" fill="#6d28d9" />
                      <rect
                        x="0"
                        y="0"
                        width="36"
                        height="36"
                        transform="translate(4 4) rotate(160 18 18) scale(1.1)"
                        fill="#F97316"
                        rx="36"
                      />
                      <g transform="translate(0 -5) rotate(0 18 18)">
                        <path
                          d="M15 20c2 1 4 1 6 0"
                          stroke="#000000"
                          fill="none"
                          strokeLinecap="round"
                        />
                        <rect
                          x="14"
                          y="14"
                          width="1.5"
                          height="2"
                          rx="1"
                          stroke="none"
                          fill="#000000"
                        />
                        <rect
                          x="20"
                          y="14"
                          width="1.5"
                          height="2"
                          rx="1"
                          stroke="none"
                          fill="#000000"
                        />
                      </g>
                    </g>
                  </svg>
                </span>
                0x58234..d6540621
              </div>
            </div>
          </div>
          <div className="flex items-center text-sm space-x-4 justify-between mb-2">
            <div className="font-medium text-slate-400 w-1/12">2</div>
            <div className="font-medium text-slate-400 text-left w-4/12">
              2AM, 22 Oct
            </div>
            <div className="text-right text-md w-7/12">
              <div
                title="0x58E78124fe7cc061E1A9c05118379E72f0ed0621"
                className="questers_questerAvt__Kes2f"
              >
                <span className="questers_souldAvatar__MEX_E">
                  <svg
                    viewBox="0 0 36 36"
                    fill="none"
                    role="img"
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                  >
                    <mask
                      id="mask__beam"
                      maskUnits="userSpaceOnUse"
                      x="0"
                      y="0"
                      width="36"
                      height="36"
                    >
                      <rect width="36" height="36" rx="72" fill="#FFFFFF" />
                    </mask>
                    <g mask="url(#mask__beam)">
                      <rect width="36" height="36" fill="#475569" />
                      <rect
                        x="0"
                        y="0"
                        width="36"
                        height="36"
                        transform="translate(5 3) rotate(51 18 18) scale(1)"
                        fill="#EAB308"
                        rx="6"
                      />
                      <g transform="translate(3 -2) rotate(1 18 18)">
                        <path
                          d="M15 19c2 1 4 1 6 0"
                          stroke="#000000"
                          fill="none"
                          strokeLinecap="round"
                        />
                        <rect
                          x="13"
                          y="14"
                          width="1.5"
                          height="2"
                          rx="1"
                          stroke="none"
                          fill="#000000"
                        />
                        <rect
                          x="21"
                          y="14"
                          width="1.5"
                          height="2"
                          rx="1"
                          stroke="none"
                          fill="#000000"
                        />
                      </g>
                    </g>
                  </svg>
                </span>
                0x58234..d6540621
              </div>
            </div>
          </div>
          <div className="flex items-center text-sm space-x-4 justify-between mb-2">
            <div className="font-medium text-slate-400 w-1/12">3</div>
            <div className="font-medium text-slate-400 text-left w-4/12">
              4PM, 20 Oct
            </div>
            <div className="text-right text-md w-7/12">
              <div
                title="0x58E78124fe7cc061E1A9c05118379E72f0ed0621"
                className="questers_questerAvt__Kes2f"
              >
                <span className="questers_souldAvatar__MEX_E">
                  <svg
                    viewBox="0 0 36 36"
                    fill="none"
                    role="img"
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                  >
                    <mask
                      id="mask__beam"
                      maskUnits="userSpaceOnUse"
                      x="0"
                      y="0"
                      width="36"
                      height="36"
                    >
                      <rect width="36" height="36" rx="72" fill="#FFFFFF" />
                    </mask>
                    <g mask="url(#mask__beam)">
                      <rect width="36" height="36" fill="#6d28d9" />
                      <rect
                        x="0"
                        y="0"
                        width="36"
                        height="36"
                        transform="translate(4 4) rotate(270 18 18) scale(1)"
                        fill="#F97316"
                        rx="6"
                      />
                      <g transform="translate(6 -2) rotate(0 18 18)">
                        <path
                          d="M15 19c2 1 4 1 6 0"
                          stroke="#000000"
                          fill="none"
                          strokeLinecap="round"
                        />
                        <rect
                          x="14"
                          y="14"
                          width="1.5"
                          height="2"
                          rx="1"
                          stroke="none"
                          fill="#000000"
                        />
                        <rect
                          x="20"
                          y="14"
                          width="1.5"
                          height="2"
                          rx="1"
                          stroke="none"
                          fill="#000000"
                        />
                      </g>
                    </g>
                  </svg>
                </span>
                0x58234..d6540621
              </div>
            </div>
          </div>
          <div className="flex items-center text-sm space-x-4 justify-between mb-2">
            <div className="font-medium text-slate-400 w-1/12">4</div>
            <div className="font-medium text-slate-400 text-left w-4/12">
              5PM, 23 Oct
            </div>
            <div className="text-right text-md w-7/12">
              <div
                title="0x58E78124fe7cc061E1A9c05118379E72f0ed0621"
                className="questers_questerAvt__Kes2f"
              >
                <span className="questers_souldAvatar__MEX_E">
                  <svg
                    viewBox="0 0 36 36"
                    fill="none"
                    role="img"
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                  >
                    <mask
                      id="mask__beam"
                      maskUnits="userSpaceOnUse"
                      x="0"
                      y="0"
                      width="36"
                      height="36"
                    >
                      <rect width="36" height="36" rx="72" fill="#FFFFFF" />
                    </mask>
                    <g mask="url(#mask__beam)">
                      <rect width="36" height="36" fill="#475569" />
                      <rect
                        x="0"
                        y="0"
                        width="36"
                        height="36"
                        transform="translate(-2 6) rotate(126 18 18) scale(1)"
                        fill="#EAB308"
                        rx="36"
                      />
                      <g transform="translate(-6 3) rotate(6 18 18)">
                        <path d="M13,19 a1,0.75 0 0,0 10,0" fill="#000000" />
                        <rect
                          x="13"
                          y="14"
                          width="1.5"
                          height="2"
                          rx="1"
                          stroke="none"
                          fill="#000000"
                        />
                        <rect
                          x="21"
                          y="14"
                          width="1.5"
                          height="2"
                          rx="1"
                          stroke="none"
                          fill="#000000"
                        />
                      </g>
                    </g>
                  </svg>
                </span>
                0x58234..d6540621
              </div>
            </div>
          </div>
          <div className="flex items-center text-sm space-x-4 justify-between mb-2">
            <div className="font-medium text-slate-400 w-1/12">5</div>
            <div className="font-medium text-slate-400 text-left w-4/12">
              1PM, 24 Oct
            </div>
            <div className="text-right text-md w-7/12">
              <div
                title="0x58E78124fe7cc061E1A9c05118379E72f0ed0621"
                className="questers_questerAvt__Kes2f"
              >
                <span className="questers_souldAvatar__MEX_E">
                  <svg
                    viewBox="0 0 36 36"
                    fill="none"
                    role="img"
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                  >
                    <mask
                      id="mask__beam"
                      maskUnits="userSpaceOnUse"
                      x="0"
                      y="0"
                      width="36"
                      height="36"
                    >
                      <rect width="36" height="36" rx="72" fill="#FFFFFF" />
                    </mask>
                    <g mask="url(#mask__beam)">
                      <rect width="36" height="36" fill="#6d28d9" />
                      <rect
                        x="0"
                        y="0"
                        width="36"
                        height="36"
                        transform="translate(4 4) rotate(270 18 18) scale(1)"
                        fill="#F97316"
                        rx="6"
                      />
                      <g transform="translate(6 -2) rotate(0 18 18)">
                        <path
                          d="M15 19c2 1 4 1 6 0"
                          stroke="#000000"
                          fill="none"
                          strokeLinecap="round"
                        />
                        <rect
                          x="14"
                          y="14"
                          width="1.5"
                          height="2"
                          rx="1"
                          stroke="none"
                          fill="#000000"
                        />
                        <rect
                          x="20"
                          y="14"
                          width="1.5"
                          height="2"
                          rx="1"
                          stroke="none"
                          fill="#000000"
                        />
                      </g>
                    </g>
                  </svg>
                </span>
                0x58234..d6540621
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* End Concept: Winner List */}
    </Fragment>
  );
};

Claim.propTypes = {
  classes: shape({
    root: string
  })
};

export default Claim;
