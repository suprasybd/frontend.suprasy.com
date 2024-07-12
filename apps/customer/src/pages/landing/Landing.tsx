import React from 'react';

const Landing = () => {
  return (
    <div className="h-screen">
      Landing
      <iframe
        src="http://localhost:4200/viseditor?rootComponent=DummyBanner"
        className="w-full h-full"
      />
    </div>
  );
};

export default Landing;
