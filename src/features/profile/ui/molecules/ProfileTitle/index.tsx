import { motion } from 'framer-motion';
import { useNavigate } from '@remix-run/react';

import Title from '$shared/ui/atoms/Title';
import profile from '$shared/assets/profile.jpg';
import Button from '$shared/ui/molecules/Button';

export default function ProfileTitle({ animation }: GlobalAnimation) {
  const navigate = useNavigate();

  const goToProjects = () => {
    navigate('/projects');
  };

  const goToPosts = () => {
    navigate('/posts');
  };

  return (
    <>
      <Title
        animation={{
          variants: animation?.variants,
        }}
        title="About 송재한"
      />
      <motion.section
        className="my-4 flex gap-8 justify-between max-md:flex-col-reverse max-md:items-center"
        variants={animation?.variants}
      >
        <div className="space-y-4">
          <p className="text-lg break-keep max-md:text-sm">
            안녕하세요! <b>모두가 편할 수 있도록 개선하는</b> 프론트엔드 개발자 송재한입니다. 저는
            레이아웃 시안을 보고 반응형을 고려하며 빠르게 구현하는데 능숙합니다. 복잡한 기능도
            사용자에게 직관적으로 전달되도록 사용자 경험을 중시하며, CSS 애니메이션과 SVG 그래픽을
            활용해 사용자 상호작용을 향상시키는 데 탁월합니다.
          </p>
          <p className="text-lg break-keep max-md:text-sm">
            <b>제한된 자원과 환경을 효율적으로 극복한 경험</b>이 있습니다. 군 복무 때 부대 행정
            처리가 수동적이어서 반나절이 걸리던 인사 행정 업무를 프로그램을 개발하여 1시간 이내로
            단축한 경험이 있습니다. 엑셀 VBA와 Javascript를 이용하여 근무표 및 문서 작성을
            자동화하여 부대 자체에 편의성을 제공하였습니다.
          </p>
          <p className="text-lg break-keep max-md:text-sm">
            <b>업무 프로세스를 생산적으로 개선한 경험</b>이 있습니다. 프론트엔드 인턴 업무 중
            리팩토링 및 유지 보수 업무에 참여하여 팀 전체의 아키텍처 및 컴포넌트 설계를
            최적화하였습니다. Compound 패턴 및 Atomic Design 패턴을 도입하여 기존 레거시 코드 대비
            30% 이상 축소 및 배포 시간 20% 단축, 컴포넌트 재사용률을 높이는 목표를 달성하였습니다.
          </p>
          <div className="w-full flex gap-2 items-center justify-center py-4 max-md:py-2 max-md:flex-col">
            <Button onClick={goToProjects} hierarchy="secondary">
              <Button.Text>프로젝트</Button.Text>
            </Button>
            <Button onClick={goToPosts} hierarchy="secondary">
              <Button.Text>트러블 슈팅</Button.Text>
            </Button>
          </div>
        </div>
        <div className="w-[250px] h-[250px] min-w-[250px] min-h-[250px] max-md:min-w-[180px] max-md:min-h-[180px] max-md:w-[180px] max-md:h-[180px]">
          <img className="w-full h-full object-cover rounded-full" src={profile} alt="profile" />
        </div>
      </motion.section>
    </>
  );
}
