import styled from '@emotion/styled';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import Header from '@components/Header';
import Divider from '@components/Divider';
import { COLOR_MAIN, COLOR_SIGNATURE } from '@utils/color';
import { fetch } from '@utils/fetch';
import useAsync from '@hooks/useAsync';
import { CHANNELS, NOT_FOUND_IMAGE, CATEGORIES } from '@utils/constants';
import { useEffect, useState } from 'react';
import Image from '@components/Image';
import { Link } from 'react-router-dom';
import maple from '../assets/img/maple.png';
import lol from '../assets/img/lol.png';
import lostark from '../assets/img/lostark.png';
import overwatch from '../assets/img/overwatch.png';
import battleground from '../assets/img/battleground.png';

const HomePageContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
`;

const RecentPostsContainer = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
`;

const SliderWrapper = styled.div`
  margin-bottom: 2rem;
`;

const SliderItemWrapper = styled.div`
  height: 10rem;
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

const settings = {
  dots: false, // 슬라이드 밑에 점 보이게
  infinite: true, // 무한으로 반복
  // speed: 500,     // 넘기는 속도
  autoplay: true, // 자동으로 넘김
  autoplaySpeed: 1500, // 자동으로 넘어가는 속도
  slidesToShow: 1, // 스크린에 보여지는 슬라이드 개수
  slidesToScroll: 1, // n장씩 뒤로 넘어가게 함
  centerMode: true, // 중앙정렬
  centerPadding: '0px', // 0px 하면 슬라이드 끝쪽 이미지가 안잘림
};

function HomePage() {
  const [posts, setPosts] = useState(null);
  const [channels, setChannels] = useState([]);
  const [images] = useState([maple, lol, battleground, lostark, overwatch]);
  useEffect(() => {
    setChannels(CHANNELS);
  }, []);

  const getPostsList = async () => {
    const mapleResult = await fetch('posts/channel/62a7367f5517e27ffcab3bcb');
    const lolResult = await fetch('posts/channel/62a736925517e27ffcab3bcf');
    const postsResult = mapleResult.concat(lolResult);
    postsResult.sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
    setPosts(postsResult);
  };

  useEffect(() => {
    getPostsList();
  }, []);

  return (
    <HomePageContainer>
      <SliderWrapper>
        <Header strong>게임 카테고리</Header>
        <Divider />
        <Slider {...settings}>
          {channels &&
            channels.map((item, index) => {
              return (
                <Link to={`/channel/${item.id}`}>
                  <SliderItemWrapper key={item.id}>
                    <Image
                      src={images[index] || NOT_FOUND_IMAGE}
                      width={342}
                      height={160}
                      alt={`${item.name} 카테고리`}
                    />
                  </SliderItemWrapper>
                </Link>
              );
            })}
        </Slider>
      </SliderWrapper>
      <RecentPostsContainer>
        <Header strong>최신 글</Header>
        <Divider />
        {posts &&
          posts.map((item) => {
            let { title } = item;
            if (title.startsWith('{')) {
              title = JSON.parse(title).tt;
            }
            const categoriesId = item.channel._id;
            const comments = item.comments.length;

            return (
              <RecentPostsWrapper key={item._id}>
                <PostCategory>{CATEGORIES[categoriesId]}</PostCategory>
                <Link to={`posts/details/${item._id}`}>
                  <PostTitle>{title}</PostTitle>
                </Link>
                <PostComments>[{comments}]</PostComments>
              </RecentPostsWrapper>
            );
          })}
      </RecentPostsContainer>
    </HomePageContainer>
  );
}

export default HomePage;
