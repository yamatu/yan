"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { Carousel } from "./types";

export default function CarouselsTab() {
  const [carousels, setCarousels] = useState<Carousel[]>([]);
  const [editingCarousel, setEditingCarousel] = useState<Carousel | null>(null);
  const [isCreatingCarousel, setIsCreatingCarousel] = useState(false);
  const [carouselFormData, setCarouselFormData] = useState({
    title: "",
    image_url: "",
    alt_text: "",
    description: "",
    sort_order: 0,
    position: "top" as "top" | "bottom",
    rotation: 0,
  });

  useEffect(() => {
    fetchCarousels();
  }, []);

  const fetchCarousels = async () => {
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080"}/api/carousels`,
      );
      setCarousels((response.data as Carousel[]) || []);
    } catch (error) {
      console.error("Failed to fetch carousels:", error);
      setCarousels([]);
    }
  };

  const handleCreateCarousel = () => {
    setCarouselFormData({
      title: "",
      image_url: "",
      alt_text: "",
      description: "",
      sort_order: 0,
      position: "top",
      rotation: 0,
    });
    setIsCreatingCarousel(true);
    setEditingCarousel(null);
  };

  const handleCloneCarousel = (item: Carousel) => {
    setIsCreatingCarousel(true);
    setEditingCarousel(null);
    setCarouselFormData({
      title: `${item.title} (Copy)`,
      image_url: item.image_url,
      alt_text: item.alt_text,
      description: item.description,
      sort_order: item.sort_order,
      position: item.position,
      rotation: item.rotation ?? 0,
    });
  };

  const handleEditCarousel = (carousel: Carousel) => {
    setEditingCarousel(carousel);
    setCarouselFormData({
      title: carousel.title,
      image_url: carousel.image_url,
      alt_text: carousel.alt_text,
      description: carousel.description,
      sort_order: carousel.sort_order,
      position: carousel.position,
      rotation: carousel.rotation ?? 0,
    });
    setIsCreatingCarousel(false);
  };

  const handleSaveCarousel = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("admin_token");
      if (!token) {
        alert("Authentication token not found. Please log in again.");
        return;
      }

      const baseUrl =
        process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";
      const payload = {
        ...carouselFormData,
        sort_order: Number(carouselFormData.sort_order) || 0,
      };

      if (editingCarousel) {
        await axios.put(
          `${baseUrl}/api/admin/carousels/${editingCarousel.id}`,
          payload,
          { headers: { Authorization: `Bearer ${token}` } },
        );
        alert("Carousel updated successfully");
      } else {
        await axios.post(`${baseUrl}/api/admin/carousels`, payload, {
          headers: { Authorization: `Bearer ${token}` },
        });
        alert("Carousel created successfully");
      }

      setEditingCarousel(null);
      setIsCreatingCarousel(false);
      fetchCarousels();
    } catch (error: any) {
      console.error("Failed to save carousel:", error);
      alert("Save failed: " + (error.response?.data?.error || error.message));
    }
  };

  const handleDeleteCarousel = async (id: number) => {
    if (!confirm("Are you sure you want to delete this carousel item?")) return;
    try {
      const token = localStorage.getItem("admin_token");
      if (!token) return;
      await axios.delete(
        `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080"}/api/admin/carousels/${id}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );
      alert("Carousel deleted successfully");
      fetchCarousels();
    } catch (error: any) {
      console.error("Failed to delete carousel:", error);
      alert("Delete failed: " + (error.response?.data?.error || error.message));
    }
  };

  if (editingCarousel || isCreatingCarousel) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-slate-900">
            {editingCarousel ? "Edit Carousel Item" : "Create New Item"}
          </h2>
          <button
            onClick={() => {
              setEditingCarousel(null);
              setIsCreatingCarousel(false);
            }}
            className="text-gray-500 hover:text-gray-700 font-medium"
          >
            Cancel
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Form */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-6">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Title
                </label>
                <input
                  type="text"
                  value={carouselFormData.title}
                  onChange={(e) =>
                    setCarouselFormData({
                      ...carouselFormData,
                      title: e.target.value,
                    })
                  }
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-500 text-gray-900 placeholder-gray-400 transition-all"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Image URL
                </label>
                <div className="flex space-x-4 items-center">
                  <input
                    type="text"
                    value={carouselFormData.image_url}
                    onChange={(e) =>
                      setCarouselFormData({
                        ...carouselFormData,
                        image_url: e.target.value,
                      })
                    }
                    className="flex-1 px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-500 text-gray-900 placeholder-gray-400 transition-all"
                    required
                  />
                  {carouselFormData.image_url && (
                    <div className="flex items-center space-x-2 flex-shrink-0">
                      <div
                        className="relative w-16"
                        style={{ paddingTop: "100%" }}
                      >
                        <div className="absolute inset-0 rounded-lg bg-gray-100 overflow-hidden border border-gray-200">
                          <img
                            src={carouselFormData.image_url}
                            alt="Preview"
                            className="w-full h-full object-cover"
                            style={{
                              transform: `rotate(${carouselFormData.rotation}deg)`,
                              transformOrigin: "center center",
                            }}
                          />
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Alt Text (SEO)
                </label>
                <input
                  type="text"
                  value={carouselFormData.alt_text}
                  onChange={(e) =>
                    setCarouselFormData({
                      ...carouselFormData,
                      alt_text: e.target.value,
                    })
                  }
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-500 text-gray-900 placeholder-gray-400 transition-all"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Description
                </label>
                <textarea
                  value={carouselFormData.description}
                  onChange={(e) =>
                    setCarouselFormData({
                      ...carouselFormData,
                      description: e.target.value,
                    })
                  }
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-500 h-24 text-gray-900 placeholder-gray-400 transition-all resize-none"
                />
              </div>
            </div>
          </div>

          {/* Sidebar Settings */}
          <div className="space-y-6">
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
              <h3 className="text-sm font-semibold text-slate-900 mb-4 uppercase tracking-wider">
                Display Settings
              </h3>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Sort Order
                  </label>
                  <input
                    type="number"
                    value={carouselFormData.sort_order}
                    onChange={(e) =>
                      setCarouselFormData({
                        ...carouselFormData,
                        sort_order: Number(e.target.value),
                      })
                    }
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-500 text-gray-900 placeholder-gray-400"
                  />
                  <p className="mt-1 text-xs text-gray-400">
                    Lower numbers appear first
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Position
                  </label>
                  <select
                    value={carouselFormData.position}
                    onChange={(e) =>
                      setCarouselFormData({
                        ...carouselFormData,
                        position: e.target.value as "top" | "bottom",
                      })
                    }
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-500 text-gray-900"
                  >
                    <option value="top">Top (Main Slider)</option>
                    <option value="bottom">Bottom (Secondary)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Image Rotation
                  </label>
                  <select
                    value={carouselFormData.rotation}
                    onChange={(e) =>
                      setCarouselFormData({
                        ...carouselFormData,
                        rotation: Number(e.target.value),
                      })
                    }
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-500 text-gray-900"
                  >
                    <option value={0}>0° (Normal)</option>
                    <option value={90}>90°</option>
                    <option value={180}>180°</option>
                    <option value={270}>270°</option>
                  </select>
                  <p className="mt-1 text-xs text-gray-400">
                    默认正方形展示，如手机拍照方向不对可以在这里旋转图片。
                  </p>
                </div>
              </div>

              <div className="mt-6 pt-6 border-t border-gray-100">
                <button
                  onClick={handleSaveCarousel}
                  className="w-full py-3 px-4 bg-sky-600 hover:bg-sky-700 text-white font-medium rounded-xl shadow-sm hover:shadow-md transition-all flex items-center justify-center"
                >
                  <svg
                    className="w-5 h-5 mr-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4"
                    />
                  </svg>
                  {editingCarousel ? "Update Item" : "Add Item"}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">
            Homepage Carousel
          </h2>
          <p className="text-gray-500 mt-1">Manage the main slider images</p>
        </div>
        <button
          onClick={handleCreateCarousel}
          className="inline-flex items-center px-5 py-2.5 bg-sky-600 text-white text-sm font-medium rounded-xl hover:bg-sky-700 shadow-sm hover:shadow-md transition-all"
        >
          <svg
            className="w-5 h-5 mr-2"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 4v16m8-8H4"
            />
          </svg>
          Add New Item
        </button>
      </div>

      {carousels.length === 0 ? (
        <div className="text-center py-24 bg-white rounded-3xl border border-gray-100 shadow-sm">
          <div className="inline-flex flex-col items-center space-y-4">
            <div className="w-20 h-20 bg-sky-50 rounded-full flex items-center justify-center mb-2">
              <svg
                className="w-10 h-10 text-sky-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-slate-900">
              No carousel items
            </h3>
            <p className="text-gray-500 max-w-sm mx-auto">
              Add high-quality images to your homepage slider.
            </p>
            <button
              onClick={handleCreateCarousel}
              className="mt-4 px-6 py-2 bg-white border border-gray-200 text-slate-700 font-medium rounded-xl hover:bg-gray-50 transition-colors"
            >
              Add Item
            </button>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {carousels.map((item) => (
            <div
              key={item.id}
              className="group bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden flex flex-col"
            >
              <div
                className="relative bg-gray-100"
                style={{ paddingTop: "100%" }}
              >
                <div className="absolute inset-0">
                  <img
                    src={item.image_url}
                    alt={item.alt_text}
                    className="w-full h-full object-cover"
                    style={{
                      transform: `rotate(${item.rotation ?? 0}deg)`,
                      transformOrigin: "center center",
                    }}
                  />
                </div>
                <div className="absolute top-2 right-2 bg-black/50 backdrop-blur-sm text-white text-xs px-2 py-1 rounded-lg">
                  Order: {item.sort_order}
                </div>
                <div className="absolute top-2 left-2 bg-sky-500/90 backdrop-blur-sm text-white text-xs px-2 py-1 rounded-lg capitalize">
                  {item.position}
                </div>
              </div>

              <div className="p-5 flex-1 flex flex-col">
                <h3 className="text-lg font-bold text-slate-900 mb-1">
                  {item.title}
                </h3>
                <p className="text-sm text-gray-500 line-clamp-2 mb-4 flex-1">
                  {item.description}
                </p>

                <div className="flex items-center justify-between pt-4 border-t border-gray-50">
                  <button
                    onClick={() => handleCloneCarousel(item)}
                    className="text-xs font-medium text-gray-500 hover:text-sky-600 flex items-center transition-colors"
                  >
                    <svg
                      className="w-4 h-4 mr-1"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                      />
                    </svg>
                    Duplicate
                  </button>

                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => handleEditCarousel(item)}
                      className="p-2 text-gray-400 hover:text-sky-600 hover:bg-sky-50 rounded-lg transition-colors"
                      title="Edit"
                    >
                      <svg
                        className="w-5 h-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                        />
                      </svg>
                    </button>
                    <button
                      onClick={() => handleDeleteCarousel(item.id)}
                      className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                      title="Delete"
                    >
                      <svg
                        className="w-5 h-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                        />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
