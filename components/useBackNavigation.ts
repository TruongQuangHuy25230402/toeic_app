import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

const useBackNavigation = (shouldWarn: boolean) => {
  const router = useRouter();

  useEffect(() => {
    const handleBeforeUnload = (event: BeforeUnloadEvent) => {
      if (shouldWarn) {
        event.preventDefault();
        event.returnValue = ''; // Hiển thị cảnh báo mặc định của trình duyệt
      }
    };

    const handleNavigation = () => {
      if (shouldWarn && !window.confirm('Bạn có chắc muốn rời khỏi trang?')) {
        // Nếu người dùng nhấn hủy, quay lại URL trước đó
        router.back();
      }
    };

    // Lắng nghe sự kiện 'beforeunload' cho các hành động làm mới hoặc đóng trang
    window.addEventListener('beforeunload', handleBeforeUnload);

    // Lắng nghe điều hướng
    const onPopState = () => handleNavigation();
    window.addEventListener('popstate', onPopState);

    return () => {
      // Dọn dẹp các sự kiện khi component unmount
      window.removeEventListener('beforeunload', handleBeforeUnload);
      window.removeEventListener('popstate', onPopState);
    };
  }, [router, shouldWarn]);
};

export default useBackNavigation;
