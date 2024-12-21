import React, { useState } from 'react';
import { ListenUI, UniversalUI } from 'ui';
import { Auth, listenQueryHooks } from 'core';

const { LoadingBackdrop } = UniversalUI;
const { MainContainer, Header, FeelingList, AudioList } = ListenUI.Minimalism;

const Home = () => {
  const [activeFeelingId, setActiveFeelingId] = useState<string>('');
  const { getAccessToken, signIn, isSignedIn } = Auth.useAuthContext();

  const queryRs = listenQueryHooks.useLoadAudios({
    getAccessToken,
  });

  if (queryRs.isLoading) {
    return <LoadingBackdrop message="Valuable things deserve waiting" />;
  }

  return (
    <UniversalUI.FullWidthContainer>
      <Header />
      <MainContainer>
        {!isSignedIn && <button onClick={signIn}>Login</button>}
        <FeelingList
          activeId={activeFeelingId}
          onSelect={setActiveFeelingId}
          feelings={queryRs.data?.tags ?? []}
        />
        <main>
          <AudioList
            list={queryRs.data?.audios ?? []}
            activeFeelingId={activeFeelingId}
            onItemSelect={function (id: string): void {
              throw new Error('Function not implemented.');
            }}
          />
        </main>
      </MainContainer>
    </UniversalUI.FullWidthContainer>
  );
};

export default Home;
