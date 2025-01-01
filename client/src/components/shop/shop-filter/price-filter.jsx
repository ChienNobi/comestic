import { useState } from "react";
import InputRange from "@/ui/input-range";
import { formatMoney } from "@/utils/formatter";

const PriceFilter = ({ priceFilterValues, maxPrice }) => {
  const { priceValue,handleChanges } = priceFilterValues;
  return (
    <>
      <div className="tp-shop-widget mb-35">
        <h3 className="tp-shop-widget-title no-border">Mức Giá</h3>

        <div className="tp-shop-widget-content">
          <div className="tp-shop-widget-filter">
            <div id="slider-range" className="mb-10">
                <InputRange
                  STEP={1}
                  MIN={0}
                  MAX={maxPrice}
                  values={priceValue}
                  handleChanges={handleChanges}
                />
            </div>
            <div className="tp-shop-widget-filter-info d-flex align-items-center justify-content-between">
              <span className="input-range">
                {formatMoney(priceValue[0])} - {formatMoney(priceValue[1])}
              </span>
              <button className="tp-shop-widget-filter-btn" type="button">
                Lọc
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default PriceFilter;
