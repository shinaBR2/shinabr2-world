import React, { useState } from 'react';
import { ListenUI, UniversalUI } from 'ui';
import { Auth, listenQueryHooks } from 'core';

const { LoadingBackdrop } = UniversalUI;
const { MainContainer, Header, FeelingList, AudioList } = ListenUI.Minimalism;

const AnonymousContent = () => {
  return <UniversalUI.Dialogs.LoginDialog />;
};

const AuthenticatedContent = () => {
  const [activeFeelingId, setActiveFeelingId] = useState<string>('');
  const { getAccessToken } = Auth.useAuthContext();
  const queryRs = listenQueryHooks.useLoadAudios({
    getAccessToken,
  });

  return (
    <>
      <FeelingList
        activeId={activeFeelingId}
        onSelect={setActiveFeelingId}
        queryRs={queryRs}
      />
      <AudioList
        queryRs={queryRs}
        list={queryRs.data?.audios ?? []}
        activeFeelingId={activeFeelingId}
        onItemSelect={function (): void {
          throw new Error('Function not implemented.');
        }}
      />
    </>
  );
};

const Home = () => {
  const { isSignedIn, isLoading: authLoading } = Auth.useAuthContext();
  console.log(`authLoading`, authLoading);

  if (authLoading) {
    return <LoadingBackdrop message="Valuable things deserve waiting" />;
  }

  return (
    <UniversalUI.FullWidthContainer>
      <Header />
      <MainContainer>
        {isSignedIn ? <AuthenticatedContent /> : <AnonymousContent />}
      </MainContainer>
    </UniversalUI.FullWidthContainer>
  );
};

export default Home;
