import React, { useState } from 'react';

import CommunityMembers from 'components/Community/CommunityMembers';
import CommunityForm from 'components/CommunityForm';
import { ConditionalRender } from 'components/ConditionalRender';
import { BackLink } from 'components/BackLink';
import { AddMemberModal } from 'components/AddMemberModal';
import { customizableComponent } from 'hocs/customization';
import { getCommunity } from 'mock/index';
import {
  CommunitySettingsTabs,
  Container,
  ActiveTabContent,
  ActiveTabContainer,
  PageHeader,
  PageTitle,
  Avatar,
  AvatarContainer,
} from './styles';
import { CloseCommunityAction, AddMemberAction } from './ExtraAction';

// TODO replace with translations keys
const tabs = {
  EDIT_PROFILE: 'Edit profile',
  MEMBERS: 'Members',
};

const CommunitySettings = ({ communityId, onSubmit, onMemberClick }) => {
  const [activeTab, setActiveTab] = useState(tabs.EDIT_PROFILE);
  const [isModalOpened, setModalOpened] = useState(false);

  const openModal = () => setModalOpened(true);
  const closeModal = () => setModalOpened(false);

  const currentCommunity = getCommunity(communityId);

  const submitAddMembers = data => {
    currentCommunity.members = data.members;
    closeModal();
  };

  return (
    <Container>
      <PageHeader>
        <AvatarContainer>
          <Avatar avatar={currentCommunity.avatar} />
        </AvatarContainer>
        <div>
          <BackLink text={`Return to ${currentCommunity.name}`} />
          <PageTitle>Community Settings</PageTitle>
        </div>
      </PageHeader>
      <div>
        <CommunitySettingsTabs
          tabs={[tabs.EDIT_PROFILE, tabs.MEMBERS]}
          activeTab={activeTab}
          onChange={setActiveTab}
        />
      </div>
      <ActiveTabContainer>
        <ConditionalRender condition={activeTab === tabs.EDIT_PROFILE}>
          <ActiveTabContent>
            <CommunityForm
              onSubmit={data => {
                onSubmit(data);
              }}
              edit
              community={currentCommunity}
            />
            <CloseCommunityAction />
          </ActiveTabContent>
        </ConditionalRender>

        <ConditionalRender condition={activeTab === tabs.MEMBERS}>
          <ActiveTabContent>
            <CommunityMembers community={currentCommunity} onMemberClick={onMemberClick} />
            <AddMemberAction action={openModal} />
            <ConditionalRender condition={isModalOpened}>
              <AddMemberModal
                closeConfirm={closeModal}
                community={currentCommunity}
                onSubmit={submitAddMembers}
              />
            </ConditionalRender>
          </ActiveTabContent>
        </ConditionalRender>
      </ActiveTabContainer>
    </Container>
  );
};

export default customizableComponent('CommunitySettings')(CommunitySettings);
