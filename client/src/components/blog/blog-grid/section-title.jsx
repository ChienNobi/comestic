import React from 'react';

const SectionTitle = ({text = ''}) => {
  return (
    <>
      <section className="tp-section-title-area pt-95 pb-80">
        <div className="container">
          <div className="row">
            <div className="col-xl-8">
              <div className="tp-section-title-wrapper-7">
                <h3 className="tp-section-title-7">{text}</h3>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default SectionTitle;
