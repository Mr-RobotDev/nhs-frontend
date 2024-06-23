import { PrimaryInput } from "@/components/ui/Input/Input";
import React from "react";
import { CardLayoutType, CardOptionsType } from "@/type";

interface CardDetailsProps {
  cardOption: CardLayoutType;
  setCardOption: React.Dispatch<React.SetStateAction<CardLayoutType>>;
  cardOptions: CardOptionsType;
  setCardName: React.Dispatch<React.SetStateAction<string>>;
  cardName: string;
}

const CardDetails = ({
  setCardOption,
  cardOption,
  cardOptions,
  cardName,
  setCardName,
}: CardDetailsProps) => {
  return (
    <div className=" p-6">
      <div className=" mt-7">
        <label>Card Name</label>
        <PrimaryInput
          value={cardName}
          onChange={(e: any) => setCardName(e.target.value)}
        />
      </div>
      <div className=" mt-7">
        <div className="mt-6">
          <span className="text-black">Select card size</span>
          <div className="flex flex-wrap">
            <div className="w-1/3 px-4 sm:px-5 py-3 pl-0 box-border">
              <div
                className={`option grid border-all-active
                ${
                  cardOption.key === cardOptions.TWO_X_TWO.key
                    ? "active-box"
                    : ""
                }
                `}
                onClick={() => {
                  setCardOption(cardOptions.TWO_X_TWO);
                }}
              >
                <div className="card selected layout-2-2"></div>
                <div className="card"></div>
                <div className="card"></div>
                <div className="card"></div>
                <div className="card"></div>
                <div className="card"></div>
                <div className="card"></div>
                <div className="card"></div>
                <div className="card"></div>
                <div className="card"></div>
                <div className="card"></div>
                <div className="card"></div>
                <div className="card"></div>
              </div>
              <div className="text-center mt-2 font-light">2 X 2</div>
            </div>
            <div className="w-1/3 px-4 sm:px-5 py-3 pl-0 box-border">
              <div
                className={`option grid border-all-active
                ${
                  cardOption.key === cardOptions.TWO_X_THREE.key
                    ? "active-box"
                    : ""
                }
                `}
                onClick={() => {
                  setCardOption(cardOptions.TWO_X_THREE);
                }}
              >
                <div className="card selected layout-2-3"></div>
                <div className="card"></div>
                <div className="card"></div>
                <div className="card"></div>
                <div className="card"></div>
                <div className="card"></div>
                <div className="card"></div>
                <div className="card"></div>
                <div className="card"></div>
                <div className="card"></div>
                <div className="card"></div>
              </div>
              <div className="text-center mt-2 font-light">2 X 3</div>
            </div>
            <div className="w-1/3 px-4 sm:px-5 py-3 box-border">
              <div
                className={`option grid border-all-active
                    ${
                      cardOption.key === cardOptions.TWO_X_FOUR.key
                        ? "active-box"
                        : ""
                    }
                    `}
                onClick={() => {
                  setCardOption(cardOptions.TWO_X_FOUR);
                }}
              >
                <div className="card selected layout-2-4"></div>
                <div className="card"></div>
                <div className="card"></div>
                <div className="card"></div>
                <div className="card"></div>
                <div className="card"></div>
                <div className="card"></div>
                <div className="card"></div>
                <div className="card"></div>
              </div>
              <div className="text-center mt-2 font-light">2 X 4</div>
            </div>
            <div className="w-1/3 px-4 sm:px-5 py-3 pl-0 box-border">
              <div
                className={`option grid border-all-active
                ${
                  cardOption.key === cardOptions.THREE_X_TWO.key
                    ? "active-box"
                    : ""
                }
                `}
                onClick={() => {
                  setCardOption(cardOptions.THREE_X_TWO);
                }}
              >
                <div className="card selected layout-3-2"></div>
                <div className="card"></div>
                <div className="card"></div>
                <div className="card"></div>
                <div className="card"></div>
                <div className="card"></div>
                <div className="card"></div>
                <div className="card"></div>
                <div className="card"></div>
                <div className="card"></div>
                <div className="card"></div>
              </div>
              <div className="text-center mt-2 font-light">3 X 2</div>
            </div>
            <div className="w-1/3 px-4 sm:px-5 py-3 pl-0 box-border">
              <div
                className={`option grid border-all-active
                ${
                  cardOption.key === cardOptions.THREE_X_THREE.key
                    ? "active-box"
                    : ""
                }
                `}
                onClick={() => {
                  setCardOption(cardOptions.THREE_X_THREE);
                }}
              >
                <div className="card selected layout-3-3"></div>
                <div className="card"></div>
                <div className="card"></div>
                <div className="card"></div>
                <div className="card"></div>
                <div className="card"></div>
                <div className="card"></div>
                <div className="card"></div>
              </div>
              <div className="text-center mt-2 font-light">3 X 3</div>
            </div>
            <div className="w-1/3 px-4 sm:px-5 py-3 pl-0 box-border">
              <div
                className={`option grid border-all-active
                ${
                  cardOption.key === cardOptions.THREE_X_FOUR.key
                    ? "active-box"
                    : ""
                }
                `}
                onClick={() => {
                  setCardOption(cardOptions.THREE_X_FOUR);
                }}
              >
                <div className="card selected layout-3-4"></div>
                <div className="card"></div>
                <div className="card"></div>
                <div className="card"></div>
                <div className="card"></div>
                <div className="card"></div>
                <div className="card"></div>
                <div className="card"></div>
              </div>
              <div className="text-center mt-2 font-light">3 X 4</div>
            </div>
            <div className="w-1/3 px-4 sm:px-5 py-3 pl-0 box-border">
              <div
                className={`option grid border-all-active
                ${
                  cardOption.key === cardOptions.FOUR_X_FOUR.key
                    ? "active-box"
                    : ""
                }
                `}
                onClick={() => {
                  setCardOption(cardOptions.FOUR_X_FOUR);
                }}
              >
                <div className="card selected layout-4-4"></div>
              </div>
              <div className="text-center mt-2 font-light">4 X 4</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CardDetails;
