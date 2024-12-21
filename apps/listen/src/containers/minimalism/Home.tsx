import React from 'react';
import { ListenUI, UniversalUI } from 'ui';
import { Auth, listenQueryHooks } from 'core';

const { LoadingBackdrop, Logo } = UniversalUI;
const { HomeContainer, Header, FeelingList, AudiosContainer } =
  ListenUI.Minimalism;

const Home = () => {
  const { getAccessToken, signIn, isSignedIn } = Auth.useAuthContext();

  const queryRs = listenQueryHooks.useLoadAudios({
    getAccessToken,
  });
  // const { audios, isLoading } = queryRs;
  console.log(`isSignedIn`, isSignedIn);
  console.log(`Home listen`, queryRs);

  if (queryRs.isLoading) {
    return <LoadingBackdrop message="Valuable things deserve waiting" />;
  }

  return (
    <HomeContainer>
      <Header />
      {!isSignedIn && <button onClick={signIn}>Login</button>}
      <FeelingList
        activeId={''}
        onSelect={function (id: string): void {
          throw new Error('Function not implemented.');
        }}
        feelings={queryRs.data.tags}
      />
      <main>
        <AudiosContainer
          list={queryRs.data.audios}
          onItemSelect={function (id: string): void {
            throw new Error('Function not implemented.');
          }}
        />
      </main>
    </HomeContainer>
  );
};

export default Home;
