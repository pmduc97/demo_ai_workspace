import React, { useState } from 'react';

export default function ContactPage() {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [submitStatus, setSubmitStatus] = useState('idle'); // 'idle' | 'submitting' | 'success' | 'error'

  const validate = (values) => {
    const errs = {};
    if (values.name.trim().length < 2) errs.name = 'Họ tên tối thiểu 2 ký tự';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email)) errs.email = 'Email không hợp lệ';
    if (values.message.trim().length < 10) errs.message = 'Nội dung tối thiểu 10 ký tự';
    return errs;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
    if (touched[name]) {
      setErrors(validate({ ...form, [name]: value }));
    }
  };

  const handleBlur = (e) => {
    const { name } = e.target;
    setTouched(prev => ({ ...prev, [name]: true }));
    setErrors(validate(form));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const errs = validate(form);
    setErrors(errs);
    setTouched({ name: true, email: true, subject: true, message: true });

    if (Object.keys(errs).length === 0) {
      setSubmitStatus('submitting');
      setTimeout(() => {
        setSubmitStatus('success');
      }, 1000);
    }
  };

  const resetForm = () => {
    setForm({ name: '', email: '', subject: '', message: '' });
    setErrors({});
    setTouched({});
    setSubmitStatus('idle');
  };

  return (
    <div className="min-h-screen bg-white py-12 px-4">
      <div className="max-w-7xl mx-auto">
        {/* PageHeader */}
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Liên Hệ</h1>
          <p className="text-lg text-gray-600">
            Hãy để lại tin nhắn, chúng tôi sẽ phản hồi sớm nhất có thể
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* ContactForm */}
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Gửi Tin Nhắn</h2>
            
            {submitStatus === 'success' ? (
              <div className="bg-green-50 border border-green-200 rounded-lg p-8 text-center">
                <div className="text-green-500 text-5xl mb-4">✓</div>
                <h3 className="text-xl font-bold text-green-800 mb-2">Cảm ơn!</h3>
                <p className="text-green-700 mb-6">Chúng tôi đã nhận được tin nhắn của bạn.</p>
                <button 
                  onClick={resetForm}
                  className="bg-green-600 text-white px-6 py-2 rounded-md hover:bg-green-700 transition-colors"
                >
                  Gửi tin nhắn khác
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Họ và tên *</label>
                  <input 
                    type="text" 
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    className={`w-full px-4 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500 ${errors.name && touched.name ? 'border-red-500' : 'border-gray-300'}`}
                    placeholder="Nhập họ và tên"
                  />
                  {errors.name && touched.name && <p className="mt-1 text-sm text-red-500">{errors.name}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email *</label>
                  <input 
                    type="email" 
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    className={`w-full px-4 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500 ${errors.email && touched.email ? 'border-red-500' : 'border-gray-300'}`}
                    placeholder="example@domain.com"
                  />
                  {errors.email && touched.email && <p className="mt-1 text-sm text-red-500">{errors.email}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Chủ đề</label>
                  <input 
                    type="text" 
                    name="subject"
                    value={form.subject}
                    onChange={handleChange}
                    maxLength={100}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Chủ đề tin nhắn"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Nội dung *</label>
                  <textarea 
                    name="message"
                    value={form.message}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    rows="5"
                    className={`w-full px-4 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500 ${errors.message && touched.message ? 'border-red-500' : 'border-gray-300'}`}
                    placeholder="Nhập nội dung tin nhắn..."
                  ></textarea>
                  {errors.message && touched.message && <p className="mt-1 text-sm text-red-500">{errors.message}</p>}
                </div>

                <button 
                  type="submit" 
                  disabled={submitStatus === 'submitting'}
                  className="w-full bg-blue-600 text-white py-3 px-4 rounded-md hover:bg-blue-700 transition-colors disabled:bg-blue-400 flex justify-center items-center"
                >
                  {submitStatus === 'submitting' ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Đang gửi...
                    </>
                  ) : 'Gửi Tin Nhắn'}
                </button>
              </form>
            )}
          </div>

          {/* ContactInfo */}
          <div>
            <div className="bg-gray-50 rounded-xl p-8 h-full">
              <h2 className="text-2xl font-bold text-gray-900 mb-8">Thông Tin Liên Hệ</h2>
              
              <div className="space-y-6">
                <div className="flex items-start">
                  <div className="text-2xl mr-4">📍</div>
                  <div>
                    <h3 className="font-medium text-gray-900">Địa chỉ</h3>
                    <p className="text-gray-600 mt-1">Hà Nội, Việt Nam</p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="text-2xl mr-4">✉️</div>
                  <div>
                    <h3 className="font-medium text-gray-900">Email</h3>
                    <p className="text-gray-600 mt-1">contact@blogdulich.vn</p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="text-2xl mr-4">🕐</div>
                  <div>
                    <h3 className="font-medium text-gray-900">Giờ làm việc</h3>
                    <p className="text-gray-600 mt-1">Thứ 2 - Thứ 6, 8:00 - 17:00</p>
                  </div>
                </div>
              </div>

              <div className="mt-12">
                <h3 className="font-medium text-gray-900 mb-4">Kết nối với chúng tôi</h3>
                <div className="flex space-x-4">
                  <a href="#" className="w-10 h-10 bg-blue-600 text-white rounded-full flex items-center justify-center hover:bg-blue-700 transition-colors">
                    f
                  </a>
                  <a href="#" className="w-10 h-10 bg-pink-600 text-white rounded-full flex items-center justify-center hover:bg-pink-700 transition-colors">
                    ig
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
