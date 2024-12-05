import { useEffect } from 'react';

const useBeforeUnload = (shouldWarn: boolean) => {
  useEffect(() => {
    const handleBeforeUnload = (event: BeforeUnloadEvent) => {
      if (shouldWarn) {
        event.preventDefault();
        event.returnValue = ''; // Hiển thị thông báo mặc định
      }
    };

    // Gắn sự kiện trước khi rời khỏi trang
    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      // Xóa sự kiện khi component unmount
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [shouldWarn]); // Theo dõi trạng thái `shouldWarn`
};

export default useBeforeUnload;
