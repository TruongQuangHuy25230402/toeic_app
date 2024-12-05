import { useEffect } from 'react';

const usePreventNavigation = (shouldWarn: boolean) => {
  useEffect(() => {
    // Hàm xử lý trước khi tải lại trang hoặc đóng tab
    const handleBeforeUnload = (event: BeforeUnloadEvent) => {
      if (shouldWarn) {
        event.preventDefault();
        event.returnValue = ''; // Cần thiết để hiển thị cảnh báo
      }
    };

    // Hàm xử lý điều hướng back/forward
    const handlePopState = () => {
      if (shouldWarn && !window.confirm('Bạn có chắc muốn rời khỏi trang này?')) {
        // Đẩy lại trạng thái hiện tại để ngăn điều hướng
        history.pushState(null, '', window.location.href);
      }
    };

    // Lắng nghe sự kiện beforeunload và popstate
    window.addEventListener('beforeunload', handleBeforeUnload);
    window.addEventListener('popstate', handlePopState);

    // Dọn dẹp sự kiện khi component bị unmount
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
      window.removeEventListener('popstate', handlePopState);
    };
  }, [shouldWarn]);

  useEffect(() => {
    if (shouldWarn) {
      // Ngăn chặn khi nhấp vào các liên kết nội bộ
      const handleLinkClick = (event: MouseEvent) => {
        const target = event.target as HTMLAnchorElement;

        if (target.tagName === 'A' && !window.confirm('Bạn có chắc muốn rời khỏi trang này?')) {
          event.preventDefault();
        }
      };

      document.addEventListener('click', handleLinkClick);

      return () => {
        document.removeEventListener('click', handleLinkClick);
      };
    }
  }, [shouldWarn]);
};

export default usePreventNavigation;
