import React, { useState, useCallback, useEffect } from 'react';
import styled from '@emotion/styled';
import GoBack from '@components/GoBack';
import Thumbnail from '@components/Thumbnail';
import useValueContext from '@hooks/useValueContext';
import EditIcon from '@mui/icons-material/Edit';
import Button from '@mui/material/Button';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { COLOR_MAIN, COLOR_SIGNATURE } from '@utils/color';
import EditFullNameModal from '@components/EditFullNameModal';
import { getUserInfo } from '@utils/user';
import { CATEGORIES } from '@utils/constants';
import useOurSnackbar from '@hooks/useOurSnackbar';
import SendIcon from '@mui/icons-material/Send';
import LoginModal from '@components/LoginModal';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import IconImages from '@assets/ChannelIcons';

const ContentWrapper = styled.div`
  padding: 1.5rem;
`;

const ProfileTopbar = styled.div`
  display: flex;
  justify-content: space-between;
`;

const NoneDecorationLink = styled(Link)`
  text-decoration: none;
  color: black;
`;

const LinkButton = styled(Button)`
  width: 8rem;
  color: black;
  background-color: white;
  border-color: ${COLOR_MAIN};

  &:hover {
    background-color: white;
    border-color: ${COLOR_MAIN};
  }
`;

const ThumbnailCover = styled.div`
  display: flex;
  justify-content: center;

  & div {
    width: 10rem;
    height: 10rem;
  }
`;

const ProfileMenuWrapper = styled.div`
  padding-top: 1rem;
  padding-bottom: 1rem;
`;

const UserFullNameWrapper = styled.div`
  text-align: center;
  position: relative;
`;

const Span = styled.span`
  font-size: 1.5rem;
`;

const EditIconRight = styled(EditIcon)`
  position: absolute;
  right: 0;
  bottom: 0;
`;

const SendIconRight = styled(SendIcon)`
  position: absolute;
  right: 0;
  bottom: 0;
`;

const UserMenuWrapper = styled.div`
  display: flex;
  justify-content: space-between;
`;

const UserMenu = styled.div`
  flex-grow: 1;
  text-align: center;
`;

const RecentPostsWrapper = styled.div`
  display: flex;
  align-items: center;
  height: 2rem;
  padding: 8px 0;
`;

const PostCategory = styled.div`
  font-size: 0.5rem;
  color: ${COLOR_MAIN};
  margin-right: 0.5rem;
  width: 5rem;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

const PostTitle = styled.div`
  font-size: 1rem;
  font-weight: 400;
  line-height: 2rem;
  color: ${COLOR_SIGNATURE};
  max-width: 10rem;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  margin-right: 0.2rem;
`;

const PostComments = styled.div`
  font-size: 0.8rem;
  line-height: 2rem;
  color: red;
`;

const MyPostContainer = styled.div`
  padding-top: 1rem;
  padding-bottom: 1rem;
`;

const GameIcon = styled.img`
  width: 24px;
  height: 24px;
`;

function ProfilePage() {
  const { user } = useValueContext();
  const { userId } = useParams();
  const [modalVisible, setModalVisible] = useState(false);
  const [targetUser, setTargetUser] = useState(null);
  const userFavoriteList = targetUser?.username
    ? JSON.parse(targetUser.username)
    : [];
  const [loginModalVisbile, setLoginModalVisible] = useState(false);
  const renderSnackbar = useOurSnackbar();
  const navigate = useNavigate();

  const handleClickEditIcon = useCallback(() => {
    setModalVisible(true);
  }, []);

  const handleCloseModal = useCallback(() => {
    setModalVisible(false);
  }, []);

  const handleCloseLoginModal = useCallback(() => {
    setLoginModalVisible(false);
  }, []);

  useEffect(() => {
    getUserInfo(userId).then((response) => setTargetUser(response));
  }, [userId]);

  const isMe = user?._id === targetUser?._id;
  const LinkToCategories = isMe ? (
    <LinkButton variant="outlined" size="small">
      <NoneDecorationLink to="/channel/categories">
        즐겨찾기 수정
      </NoneDecorationLink>
    </LinkButton>
  ) : null;
  const Name = isMe ? user?.fullName : targetUser?.fullName;
  const EditFullNameIcon = isMe ? (
    <>
      <EditIconRight onClick={handleClickEditIcon} />
      <EditFullNameModal
        visible={modalVisible}
        handleCloseModal={handleCloseModal}
        onSuccess={() => renderSnackbar('이름 변경', true)}
        onError={() => renderSnackbar('이름 변경', false)}
      />
    </>
  ) : (
    <SendIconRight
      onClick={() => {
        if (user) {
          navigate(`/message/${targetUser._id}`);
          return;
        }
        setLoginModalVisible(true);
      }}
    />
  );

  return (
    <ContentWrapper>
      <ProfileTopbar>
        <GoBack />
        {LinkToCategories}
      </ProfileTopbar>
      <ThumbnailCover>
        <Thumbnail
          image={targetUser?.image || null}
          name={targetUser?.fullName || ' '}
          badge={!targetUser || false}
          isOnline={targetUser?.isOnline}
        />
      </ThumbnailCover>
      <ProfileMenuWrapper>
        <UserFullNameWrapper>
          <Span>{Name || ' '}</Span>
          {EditFullNameIcon}
        </UserFullNameWrapper>
        <hr />
        <UserMenuWrapper>
          <UserMenu>작성한 글&nbsp;{targetUser?.posts?.length || 0}</UserMenu>
          <UserMenu>
            작성한 댓글&nbsp;{targetUser?.comments?.length || 0}
          </UserMenu>
          <UserMenu>좋아요한 글&nbsp;{targetUser?.likes?.length || 0}</UserMenu>
        </UserMenuWrapper>
      </ProfileMenuWrapper>
      <MyPostContainer>
        <div>즐겨찾는 채널 목록</div>
        {userFavoriteList.length ? (
          userFavoriteList.map((item) => (
            <ListItem key={item} disablePadding>
              <Link to={`/channel/${item}`}>
                <ListItemButton>
                  <ListItemIcon>
                    <GameIcon src={`${IconImages[item]}`} />
                  </ListItemIcon>
                  <ListItemText primary={CATEGORIES[item]} />
                </ListItemButton>
              </Link>
            </ListItem>
          ))
        ) : (
          <RecentPostsWrapper>아직 즐겨찾는 채널이 없습니다</RecentPostsWrapper>
        )}
      </MyPostContainer>
      <MyPostContainer>
        <div>작성한 글 목록</div>
        {targetUser?.posts?.length ? (
          targetUser.posts.slice(0, 5).map((post) => {
            const { _id, channel, comments } = post;
            let { title } = post;
            if (title.startsWith('{')) {
              title = JSON.parse(title).dt;
            }
            return (
              <RecentPostsWrapper key={_id}>
                <PostCategory>{CATEGORIES[channel]}</PostCategory>
                <Link to={`/posts/details/${_id}`}>
                  <PostTitle>{title}</PostTitle>
                </Link>
                <PostComments>[{comments.length}]</PostComments>
              </RecentPostsWrapper>
            );
          })
        ) : (
          <RecentPostsWrapper>아직 작성한 글이 없습니다</RecentPostsWrapper>
        )}
      </MyPostContainer>
      <LoginModal
        visible={loginModalVisbile}
        handleCloseModal={handleCloseLoginModal}
      />
    </ContentWrapper>
  );
}

export default ProfilePage;
