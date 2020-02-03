import {Scene} from "@engine/scene/scene";
import {Color} from "@engine/renderer/common/color";
import {DraggableBehaviour} from "@engine/behaviour/impl/draggable";
import {PolyLine} from "@engine/renderable/impl/geometry/polyLine";


export class MainScene extends Scene {



    public onPreloading() {


        // https://danmarshall.github.io/google-font-to-svg-path/
        const polyLine1:PolyLine = PolyLine.fromSvgPath(this.game,`
           M 255.029 35.181 L 249.097 36.841 Q 248.84 36.911 248.429 37.058 A 19.029 19.029 0 0 0 248.389 37.073 A 2.706 2.706 0 0 1 247.875 37.205 A 2.273 2.273 0 0 1 247.534 37.231 A 1.154 1.154 0 0 1 247.2 37.185 A 0.985 0.985 0 0 1 246.936 37.061 Q 246.705 36.906 246.682 36.553 A 1.233 1.233 0 0 1 246.68 36.475 L 246.68 36.328 Q 246.78 35.422 246.858 34.706 A 354.961 354.961 0 0 0 246.924 34.094 A 245.277 245.277 0 0 1 247.019 33.221 A 180.275 180.275 0 0 1 247.107 32.434 A 46.086 46.086 0 0 0 247.253 30.945 Q 247.295 30.433 247.355 29.806 A 140.802 140.802 0 0 1 247.412 29.211 Q 247.51 28.223 247.644 26.868 Q 247.775 25.545 247.964 23.584 A 2201.38 2201.38 0 0 0 247.974 23.486 A 113.812 113.812 0 0 0 248.193 20.947 Q 248.291 19.653 248.291 18.555 A 8.607 8.607 0 0 0 248.256 17.765 A 6.899 6.899 0 0 0 248.181 17.2 A 3.448 3.448 0 0 0 248.029 16.62 A 2.646 2.646 0 0 0 247.791 16.126 Q 247.51 15.674 247.022 15.43 Q 246.533 15.186 245.776 15.186 A 3.601 3.601 0 0 0 245.395 15.208 Q 244.914 15.26 244.226 15.43 A 7.308 7.308 0 0 0 242.75 15.974 A 8.603 8.603 0 0 0 242.261 16.235 A 6.34 6.34 0 0 0 240.539 17.698 A 7.186 7.186 0 0 0 240.527 17.712 Q 239.771 18.628 239.673 19.971 A 306.998 306.998 0 0 1 239.566 21.252 Q 239.524 21.755 239.483 22.207 A 156.593 156.593 0 0 1 239.404 23.059 A 218.214 218.214 0 0 1 239.316 23.965 Q 239.281 24.32 239.248 24.637 A 107.027 107.027 0 0 1 239.185 25.232 A 2794.256 2794.256 0 0 0 239.138 25.657 Q 239.072 26.263 239.026 26.685 Q 238.984 27.071 238.959 27.376 A 14.443 14.443 0 0 0 238.94 27.637 Q 238.918 27.728 238.873 28.119 A 26.859 26.859 0 0 0 238.867 28.174 A 71.485 71.485 0 0 0 238.829 28.527 Q 238.812 28.685 238.794 28.859 A 135.38 135.38 0 0 0 238.757 29.224 A 112.711 112.711 0 0 0 238.696 29.852 A 133.38 133.38 0 0 0 238.635 30.518 A 133.38 133.38 0 0 1 238.574 31.183 A 112.711 112.711 0 0 1 238.513 31.812 A 87.702 87.702 0 0 0 238.471 32.245 Q 238.455 32.416 238.441 32.57 A 45.803 45.803 0 0 0 238.416 32.861 Q 238.381 33.273 238.379 33.384 A 0.716 0.716 0 0 0 238.379 33.398 Q 238.379 33.533 238.385 33.638 A 2.512 2.512 0 0 0 238.391 33.728 Q 238.403 33.862 238.403 33.984 A 0.374 0.374 0 0 1 238.287 34.257 A 0.567 0.567 0 0 1 238.22 34.314 Q 238.037 34.448 237.402 34.619 L 230.933 36.841 A 16.303 16.303 0 0 1 230.788 36.893 Q 230.587 36.964 230.315 37.055 A 52.272 52.272 0 0 1 230.225 37.085 A 2.873 2.873 0 0 1 229.685 37.211 A 2.449 2.449 0 0 1 229.37 37.231 A 1.154 1.154 0 0 1 229.036 37.185 A 0.985 0.985 0 0 1 228.772 37.061 Q 228.541 36.906 228.518 36.553 A 1.233 1.233 0 0 1 228.516 36.475 L 230.737 11.523 A 12.638 12.638 0 0 1 230.776 11.157 Q 230.836 10.66 230.915 10.429 A 1.089 1.089 0 0 1 230.92 10.413 Q 231.017 10.145 231.367 10.037 A 1.321 1.321 0 0 1 231.47 10.01 A 948.493 948.493 0 0 1 236.035 9.119 A 39.867 39.867 0 0 0 240.601 7.959 A 0.966 0.966 0 0 1 240.673 7.962 Q 240.782 7.97 240.82 8.005 A 0.068 0.068 0 0 1 240.833 8.02 A 0.21 0.21 0 0 1 240.853 8.069 Q 240.868 8.118 240.869 8.187 A 0.775 0.775 0 0 1 240.869 8.203 Q 240.869 8.252 240.857 8.35 A 1.999 1.999 0 0 1 240.851 8.395 Q 240.833 8.511 240.784 8.789 A 24.386 24.386 0 0 0 240.75 8.982 Q 240.695 9.304 240.613 9.824 A 19.331 19.331 0 0 0 240.613 9.827 Q 240.529 10.359 240.395 11.214 A 3828.806 3828.806 0 0 0 240.308 11.768 Q 241.992 10.791 243.469 10.193 A 24.297 24.297 0 0 1 244.904 9.662 A 18.877 18.877 0 0 1 246.253 9.265 A 18.276 18.276 0 0 1 247.672 8.964 A 14.458 14.458 0 0 1 248.706 8.826 A 24.563 24.563 0 0 1 250.05 8.733 A 19.86 19.86 0 0 1 250.855 8.716 A 8.949 8.949 0 0 1 252.733 8.9 Q 254.761 9.336 255.859 10.803 A 6.704 6.704 0 0 1 256.834 12.73 Q 257.421 14.503 257.422 17.061 A 29.319 29.319 0 0 1 257.422 17.065 Q 257.422 17.651 257.398 18.274 A 17.789 17.789 0 0 1 257.317 19.391 A 19.536 19.536 0 0 1 257.3 19.556 L 256.177 30.054 A 24.059 24.059 0 0 0 256.079 31.039 A 18.512 18.512 0 0 0 256.03 31.946 A 57.049 57.049 0 0 0 256.014 32.758 Q 256.008 33.175 256.006 33.643 A 102.382 102.382 0 0 0 256.006 33.96 Q 256.006 34.094 256.012 34.2 A 2.512 2.512 0 0 0 256.018 34.29 Q 256.027 34.392 256.03 34.474 A 1.777 1.777 0 0 1 256.03 34.522 Q 256.03 34.728 255.868 34.849 A 0.51 0.51 0 0 1 255.847 34.863 Q 255.664 34.985 255.029 35.181 Z M 190.601 23.047 L 183.472 23.169 L 182.593 34.009 A 1.347 1.347 0 0 1 182.471 34.436 A 0.766 0.766 0 0 1 182.178 34.766 Q 182.115 34.807 181.741 34.983 A 37.228 37.228 0 0 1 181.604 35.046 Q 181.116 35.273 180.383 35.58 A 66.209 66.209 0 0 1 180.347 35.596 A 132.934 132.934 0 0 1 179.553 35.925 A 172.032 172.032 0 0 1 178.687 36.279 A 37.386 37.386 0 0 1 176.904 36.951 A 34.016 34.016 0 0 1 176.062 37.231 A 25.187 25.187 0 0 1 175.293 37.463 Q 174.658 37.643 174.262 37.667 A 1.929 1.929 0 0 1 174.146 37.671 A 2.259 2.259 0 0 1 173.569 37.599 A 1.968 1.968 0 0 1 173.254 37.488 A 0.648 0.648 0 0 1 172.882 37.022 Q 172.852 36.897 172.852 36.743 Q 172.827 35.522 172.913 34.045 A 136.582 136.582 0 0 1 173.12 31.043 Q 173.242 29.517 173.389 28.04 A 165.334 165.334 0 0 0 173.523 26.627 A 123.96 123.96 0 0 0 173.633 25.342 L 173.804 23.291 Q 171.753 23.291 170.874 23.181 A 2.566 2.566 0 0 1 170.564 23.125 Q 170.252 23.046 170.111 22.898 A 0.406 0.406 0 0 1 169.995 22.607 A 0.755 0.755 0 0 1 170.031 22.391 Q 170.109 22.13 170.361 21.777 Q 170.714 21.291 171.13 20.665 A 54.008 54.008 0 0 0 171.521 20.068 A 180.68 180.68 0 0 0 172.691 18.234 A 166.305 166.305 0 0 0 172.766 18.115 A 301.432 301.432 0 0 0 173.262 17.324 Q 173.487 16.963 173.686 16.641 A 169.126 169.126 0 0 0 173.816 16.431 Q 174.268 15.698 174.39 15.527 L 174.854 8.813 Q 174.535 8.813 174.273 8.819 A 16.609 16.609 0 0 0 174.048 8.826 A 93.607 93.607 0 0 0 173.721 8.838 A 69.762 69.762 0 0 0 173.425 8.85 A 89.887 89.887 0 0 0 173.154 8.862 A 72.936 72.936 0 0 0 172.9 8.875 A 9.926 9.926 0 0 1 172.521 8.886 A 11.42 11.42 0 0 1 172.388 8.887 A 16.35 16.35 0 0 1 171.844 8.878 Q 171.091 8.853 170.715 8.752 Q 170.215 8.618 170.215 8.252 Q 170.215 8.111 170.413 7.723 A 7.424 7.424 0 0 1 170.508 7.544 A 21.416 21.416 0 0 1 170.746 7.119 Q 170.961 6.746 171.228 6.311 A 60.621 60.621 0 0 1 171.674 5.597 A 72.207 72.207 0 0 1 172.156 4.846 A 46.111 46.111 0 0 0 172.629 4.105 A 35.202 35.202 0 0 0 173.047 3.418 L 174.512 0.928 L 185.62 0.537 Q 187.769 0.464 189.893 0.378 A 7625.622 7625.622 0 0 0 191.934 0.296 A 5932.336 5932.336 0 0 0 193.811 0.22 Q 195.045 0.169 196.042 0.125 A 351.033 351.033 0 0 0 196.899 0.085 A 11550.16 11550.16 0 0 0 197.493 0.057 Q 198.321 0.018 198.706 0 A 0.226 0.226 0 0 1 198.718 0 Q 198.749 0.002 198.827 0.011 A 8.404 8.404 0 0 1 198.84 0.012 A 0.598 0.598 0 0 1 198.961 0.039 A 0.825 0.825 0 0 1 199.071 0.085 A 0.538 0.538 0 0 1 199.184 0.161 Q 199.23 0.202 199.275 0.255 A 1.028 1.028 0 0 1 199.304 0.293 A 0.493 0.493 0 0 1 199.379 0.445 Q 199.414 0.557 199.414 0.708 A 0.377 0.377 0 0 1 199.402 0.787 Q 199.359 0.97 199.165 1.457 A 23.831 23.831 0 0 1 199.072 1.685 A 62.86 62.86 0 0 0 198.883 2.15 Q 198.669 2.682 198.377 3.428 A 280.977 280.977 0 0 0 198.096 4.15 L 197.022 6.982 A 2.791 2.791 0 0 1 196.898 7.245 Q 196.827 7.377 196.749 7.481 A 1.292 1.292 0 0 1 196.631 7.617 Q 196.462 7.786 196.005 7.84 A 3.704 3.704 0 0 1 195.703 7.861 Q 194.873 7.886 194.019 7.935 A 570.585 570.585 0 0 1 192.317 8.029 A 620.588 620.588 0 0 1 192.261 8.032 L 184.839 8.398 A 148.72 148.72 0 0 0 184.771 8.844 Q 184.678 9.459 184.633 9.806 A 21.065 21.065 0 0 0 184.631 9.814 Q 184.57 10.278 184.558 10.584 Q 184.546 10.889 184.546 11.194 Q 184.546 11.499 184.522 12.158 A 18.075 18.075 0 0 1 184.502 12.486 Q 184.492 12.613 184.482 12.727 A 8.654 8.654 0 0 1 184.461 12.939 A 137.741 137.741 0 0 1 184.387 13.562 A 47.253 47.253 0 0 0 184.351 13.876 A 55.882 55.882 0 0 0 184.314 14.209 Q 184.278 14.543 184.254 15.039 A 25.496 25.496 0 0 0 184.253 15.063 A 2654.601 2654.601 0 0 0 187.415 14.966 A 554.819 554.819 0 0 0 188.904 14.917 A 429.358 429.358 0 0 0 190.271 14.868 A 2849.502 2849.502 0 0 0 191.201 14.833 Q 191.568 14.819 191.9 14.807 A 1525.916 1525.916 0 0 0 192.529 14.783 A 95.954 95.954 0 0 1 192.97 14.767 Q 193.515 14.748 193.807 14.746 A 9.827 9.827 0 0 1 193.872 14.746 A 0.631 0.631 0 0 1 194.046 14.772 Q 194.17 14.808 194.312 14.893 A 0.458 0.458 0 0 1 194.506 15.133 Q 194.537 15.216 194.549 15.321 A 1.196 1.196 0 0 1 194.556 15.454 Q 194.556 15.63 194.496 15.845 A 2.225 2.225 0 0 1 194.482 15.894 A 4.778 4.778 0 0 1 194.423 16.097 Q 194.351 16.326 194.233 16.64 A 21.009 21.009 0 0 1 194.116 16.943 A 1063.726 1063.726 0 0 1 193.848 17.624 Q 193.688 18.033 193.506 18.494 A 58.978 58.978 0 0 1 193.146 19.385 A 70.548 70.548 0 0 1 192.749 20.325 A 260.533 260.533 0 0 0 191.943 22.217 A 2.344 2.344 0 0 1 191.822 22.471 Q 191.695 22.697 191.541 22.827 A 0.618 0.618 0 0 1 191.372 22.924 Q 191.11 23.029 190.601 23.047 Z M 31.03 1.66 L 18.091 33.813 A 80.251 80.251 0 0 0 17.915 34.276 A 70.844 70.844 0 0 0 17.859 34.424 A 2.403 2.403 0 0 1 17.578 34.961 Q 17.407 35.205 17.151 35.4 Q 16.911 35.584 16.552 35.702 A 2.973 2.973 0 0 1 16.504 35.718 Q 14.966 36.206 13.452 36.56 Q 11.939 36.914 10.4 37.427 A 7.023 7.023 0 0 1 10.191 37.493 Q 10.025 37.543 9.888 37.573 A 2.106 2.106 0 0 1 9.648 37.613 A 1.702 1.702 0 0 1 9.473 37.622 A 1.389 1.389 0 0 1 9.245 37.605 Q 9.124 37.585 9.029 37.541 A 0.569 0.569 0 0 1 8.838 37.402 A 1.259 1.259 0 0 1 8.643 37.103 A 1.703 1.703 0 0 1 8.545 36.841 L 0.195 3.638 Q 0.001 3.006 0 2.593 A 1.769 1.769 0 0 1 0 2.588 A 1.385 1.385 0 0 1 0.069 2.142 A 1.177 1.177 0 0 1 0.342 1.697 A 1.584 1.584 0 0 1 0.643 1.458 Q 0.95 1.266 1.422 1.12 A 5.304 5.304 0 0 1 1.453 1.111 A 10.37 10.37 0 0 1 2.062 0.949 Q 2.656 0.809 3.43 0.684 A 96.727 96.727 0 0 1 4.414 0.53 Q 4.856 0.464 5.352 0.392 A 199.336 199.336 0 0 1 6.397 0.244 A 55.16 55.16 0 0 1 7 0.161 Q 7.471 0.099 7.837 0.061 A 13.567 13.567 0 0 1 8.252 0.024 Q 8.579 0 8.838 0 A 3.384 3.384 0 0 1 9.144 0.013 Q 9.6 0.054 9.778 0.232 Q 10.007 0.462 10.201 0.942 A 4.228 4.228 0 0 1 10.205 0.952 L 14.868 21.118 L 21.436 2.588 A 17.678 17.678 0 0 1 21.507 2.402 Q 21.61 2.136 21.692 1.953 Q 21.802 1.709 22.107 1.526 A 2.167 2.167 0 0 1 22.322 1.414 Q 22.562 1.305 22.914 1.196 A 8.763 8.763 0 0 1 23.035 1.16 Q 23.511 1.019 24.31 0.844 A 46.39 46.39 0 0 1 24.829 0.732 Q 26.66 0.342 27.857 0.171 Q 29.053 0 29.785 0 A 6.173 6.173 0 0 1 30.16 0.011 Q 30.774 0.048 30.994 0.22 A 0.713 0.713 0 0 1 31.262 0.688 A 1.063 1.063 0 0 1 31.274 0.855 Q 31.299 1.025 31.213 1.209 A 4.063 4.063 0 0 0 31.148 1.358 Q 31.091 1.492 31.03 1.66 Z M 100.122 17.139 L 95.581 17.139 Q 95.239 19.702 94.934 22.253 Q 94.629 24.805 94.556 27.026 A 10.248 10.248 0 0 0 94.575 27.683 Q 94.596 27.997 94.637 28.266 A 4.658 4.658 0 0 0 94.702 28.613 A 3.658 3.658 0 0 0 94.825 29.035 Q 94.95 29.38 95.129 29.614 A 1.705 1.705 0 0 0 95.499 29.974 A 1.504 1.504 0 0 0 95.801 30.139 A 2.146 2.146 0 0 0 96.354 30.279 A 2.719 2.719 0 0 0 96.68 30.298 Q 97.461 30.298 98.389 30.066 A 14.883 14.883 0 0 0 100.244 29.468 A 7.121 7.121 0 0 1 100.451 29.385 Q 100.615 29.323 100.745 29.285 A 1.865 1.865 0 0 1 100.886 29.249 Q 100.953 29.235 101.012 29.228 A 0.837 0.837 0 0 1 101.099 29.224 A 0.414 0.414 0 0 1 101.231 29.244 Q 101.369 29.29 101.428 29.443 A 1.463 1.463 0 0 1 101.471 29.574 Q 101.534 29.798 101.598 30.203 A 12.15 12.15 0 0 1 101.599 30.212 A 30.173 30.173 0 0 0 101.647 30.511 Q 101.727 30.994 101.856 31.689 A 18.275 18.275 0 0 0 101.999 32.385 Q 102.161 33.104 102.417 34.033 Q 102.434 34.117 102.445 34.184 A 2.632 2.632 0 0 1 102.454 34.241 A 1.255 1.255 0 0 1 102.464 34.333 A 0.98 0.98 0 0 1 102.466 34.399 A 0.71 0.71 0 0 1 102.441 34.592 A 0.478 0.478 0 0 1 102.21 34.888 Q 102.015 34.999 101.63 35.138 A 10.801 10.801 0 0 1 101.367 35.23 Q 100.366 35.571 99.255 35.925 A 50.788 50.788 0 0 1 97.058 36.572 A 27.134 27.134 0 0 1 95.541 36.937 A 23.323 23.323 0 0 1 94.971 37.048 A 12.862 12.862 0 0 1 94.198 37.167 Q 93.662 37.231 93.213 37.231 Q 90.676 37.231 88.994 36.447 A 5.448 5.448 0 0 1 87.268 35.205 A 6.265 6.265 0 0 1 85.991 33.025 Q 85.4 31.363 85.4 29.028 A 22.207 22.207 0 0 1 85.449 27.576 A 59.992 59.992 0 0 1 85.536 26.424 A 67.669 67.669 0 0 1 85.571 26.025 A 315.191 315.191 0 0 0 85.8 23.648 A 266.313 266.313 0 0 0 85.999 21.399 A 318.577 318.577 0 0 1 86.28 18.224 A 279.616 279.616 0 0 1 86.377 17.212 L 83.814 17.212 Q 82.495 17.212 81.909 17.102 A 1.598 1.598 0 0 1 81.695 17.048 Q 81.46 16.969 81.373 16.83 A 0.333 0.333 0 0 1 81.323 16.65 A 0.196 0.196 0 0 1 81.333 16.597 Q 81.373 16.466 81.567 16.126 Q 81.812 15.698 82.19 15.1 A 189.509 189.509 0 0 1 82.584 14.481 A 233.063 233.063 0 0 1 83.008 13.818 A 78.691 78.691 0 0 1 83.438 13.156 A 65.784 65.784 0 0 1 83.85 12.537 A 359.132 359.132 0 0 0 84.137 12.11 Q 84.363 11.774 84.546 11.499 A 65.718 65.718 0 0 1 84.648 11.346 Q 84.853 11.041 84.912 10.962 L 86.646 10.962 A 424.925 424.925 0 0 0 86.75 10.072 Q 86.899 8.792 87 7.849 A 882.618 882.618 0 0 0 87.064 7.247 Q 87.149 6.442 87.211 5.845 A 297.552 297.552 0 0 0 87.219 5.762 A 43.909 43.909 0 0 1 87.261 5.37 Q 87.309 4.948 87.352 4.65 A 10.624 10.624 0 0 1 87.378 4.48 A 6.848 6.848 0 0 1 87.42 4.244 Q 87.462 4.032 87.508 3.889 A 1.45 1.45 0 0 1 87.537 3.809 Q 87.587 3.679 87.655 3.605 A 0.313 0.313 0 0 1 87.756 3.528 A 1.211 1.211 0 0 1 87.864 3.486 Q 87.917 3.467 87.978 3.451 A 2.786 2.786 0 0 1 88.11 3.418 A 107.512 107.512 0 0 1 89.717 3.109 A 96.302 96.302 0 0 1 90.234 3.015 A 181.137 181.137 0 0 0 92.285 2.637 A 43.935 43.935 0 0 0 94.373 2.185 A 42.069 42.069 0 0 0 96.014 1.752 A 48.223 48.223 0 0 0 96.582 1.587 A 0.7 0.7 0 0 0 96.612 1.586 Q 96.656 1.584 96.676 1.576 A 0.052 0.052 0 0 0 96.68 1.575 A 0.075 0.075 0 0 1 96.695 1.569 Q 96.722 1.563 96.777 1.563 Q 97.06 1.563 97.07 1.744 A 0.247 0.247 0 0 1 97.07 1.758 L 97.07 1.807 A 124.196 124.196 0 0 1 97.001 2.544 Q 96.921 3.371 96.805 4.478 A 455.567 455.567 0 0 1 96.692 5.542 Q 96.453 7.776 96.16 10.563 A 3315.878 3315.878 0 0 0 96.118 10.962 L 102.661 10.962 A 0.591 0.591 0 0 1 102.936 11.031 A 0.79 0.79 0 0 1 103.04 11.096 A 0.415 0.415 0 0 1 103.187 11.303 Q 103.223 11.408 103.223 11.548 A 0.337 0.337 0 0 1 103.212 11.616 Q 103.168 11.812 102.93 12.427 A 27.534 27.534 0 0 1 102.768 12.834 Q 102.54 13.397 102.21 14.152 A 91.077 91.077 0 0 1 102.1 14.404 L 101.221 16.382 A 2.842 2.842 0 0 1 101.113 16.592 Q 100.993 16.801 100.867 16.919 A 0.516 0.516 0 0 1 100.734 17.005 Q 100.526 17.104 100.122 17.139 Z M 278.809 17.139 L 274.268 17.139 Q 273.926 19.702 273.621 22.253 Q 273.315 24.805 273.242 27.026 A 10.248 10.248 0 0 0 273.262 27.683 Q 273.282 27.997 273.323 28.266 A 4.658 4.658 0 0 0 273.389 28.613 A 3.658 3.658 0 0 0 273.511 29.035 Q 273.636 29.38 273.816 29.614 A 1.705 1.705 0 0 0 274.185 29.974 A 1.504 1.504 0 0 0 274.487 30.139 A 2.146 2.146 0 0 0 275.04 30.279 A 2.719 2.719 0 0 0 275.366 30.298 Q 276.148 30.298 277.075 30.066 A 14.883 14.883 0 0 0 278.931 29.468 A 7.121 7.121 0 0 1 279.137 29.385 Q 279.301 29.323 279.431 29.285 A 1.865 1.865 0 0 1 279.572 29.249 Q 279.639 29.235 279.698 29.228 A 0.837 0.837 0 0 1 279.785 29.224 A 0.414 0.414 0 0 1 279.918 29.244 Q 280.055 29.29 280.115 29.443 A 1.463 1.463 0 0 1 280.158 29.574 Q 280.221 29.798 280.284 30.203 A 12.15 12.15 0 0 1 280.286 30.212 A 30.173 30.173 0 0 0 280.334 30.511 Q 280.414 30.994 280.542 31.689 A 18.275 18.275 0 0 0 280.686 32.385 Q 280.847 33.104 281.104 34.033 Q 281.12 34.117 281.131 34.184 A 2.632 2.632 0 0 1 281.14 34.241 A 1.255 1.255 0 0 1 281.15 34.333 A 0.98 0.98 0 0 1 281.152 34.399 A 0.71 0.71 0 0 1 281.128 34.592 A 0.478 0.478 0 0 1 280.896 34.888 Q 280.701 34.999 280.316 35.138 A 10.801 10.801 0 0 1 280.054 35.23 Q 279.053 35.571 277.942 35.925 A 50.788 50.788 0 0 1 275.745 36.572 A 27.134 27.134 0 0 1 274.227 36.937 A 23.323 23.323 0 0 1 273.657 37.048 A 12.862 12.862 0 0 1 272.884 37.167 Q 272.349 37.231 271.899 37.231 Q 269.362 37.231 267.681 36.447 A 5.448 5.448 0 0 1 265.955 35.205 A 6.265 6.265 0 0 1 264.678 33.025 Q 264.087 31.363 264.087 29.028 A 22.207 22.207 0 0 1 264.136 27.576 A 59.992 59.992 0 0 1 264.223 26.424 A 67.669 67.669 0 0 1 264.258 26.025 A 315.191 315.191 0 0 0 264.487 23.648 A 266.313 266.313 0 0 0 264.685 21.399 A 318.577 318.577 0 0 1 264.967 18.224 A 279.616 279.616 0 0 1 265.064 17.212 L 262.5 17.212 Q 261.182 17.212 260.596 17.102 A 1.598 1.598 0 0 1 260.382 17.048 Q 260.146 16.969 260.06 16.83 A 0.333 0.333 0 0 1 260.01 16.65 A 0.196 0.196 0 0 1 260.02 16.597 Q 260.059 16.466 260.254 16.126 Q 260.498 15.698 260.877 15.1 A 189.509 189.509 0 0 1 261.27 14.481 A 233.063 233.063 0 0 1 261.694 13.818 A 78.691 78.691 0 0 1 262.125 13.156 A 65.784 65.784 0 0 1 262.537 12.537 A 359.132 359.132 0 0 0 262.823 12.11 Q 263.049 11.774 263.232 11.499 A 65.718 65.718 0 0 1 263.335 11.346 Q 263.539 11.041 263.599 10.962 L 265.332 10.962 A 424.925 424.925 0 0 0 265.437 10.072 Q 265.585 8.792 265.686 7.849 A 882.618 882.618 0 0 0 265.75 7.247 Q 265.836 6.442 265.897 5.845 A 297.552 297.552 0 0 0 265.906 5.762 A 43.909 43.909 0 0 1 265.948 5.37 Q 265.995 4.948 266.038 4.65 A 10.624 10.624 0 0 1 266.065 4.48 A 6.848 6.848 0 0 1 266.107 4.244 Q 266.149 4.032 266.195 3.889 A 1.45 1.45 0 0 1 266.223 3.809 Q 266.274 3.679 266.341 3.605 A 0.313 0.313 0 0 1 266.443 3.528 A 1.211 1.211 0 0 1 266.55 3.486 Q 266.603 3.467 266.665 3.451 A 2.786 2.786 0 0 1 266.797 3.418 A 107.512 107.512 0 0 1 268.404 3.109 A 96.302 96.302 0 0 1 268.921 3.015 A 181.137 181.137 0 0 0 270.972 2.637 A 43.935 43.935 0 0 0 273.059 2.185 A 42.069 42.069 0 0 0 274.7 1.752 A 48.223 48.223 0 0 0 275.269 1.587 A 0.7 0.7 0 0 0 275.298 1.586 Q 275.343 1.584 275.363 1.576 A 0.052 0.052 0 0 0 275.366 1.575 A 0.075 0.075 0 0 1 275.382 1.569 Q 275.409 1.563 275.464 1.563 Q 275.746 1.563 275.757 1.744 A 0.247 0.247 0 0 1 275.757 1.758 L 275.757 1.807 A 124.196 124.196 0 0 1 275.687 2.544 Q 275.607 3.371 275.491 4.478 A 455.567 455.567 0 0 1 275.378 5.542 Q 275.139 7.776 274.847 10.563 A 3315.878 3315.878 0 0 0 274.805 10.962 L 281.348 10.962 A 0.591 0.591 0 0 1 281.622 11.031 A 0.79 0.79 0 0 1 281.726 11.096 A 0.415 0.415 0 0 1 281.874 11.303 Q 281.909 11.408 281.909 11.548 A 0.337 0.337 0 0 1 281.899 11.616 Q 281.854 11.812 281.616 12.427 A 27.534 27.534 0 0 1 281.455 12.834 Q 281.226 13.397 280.897 14.152 A 91.077 91.077 0 0 1 280.786 14.404 L 279.907 16.382 A 2.842 2.842 0 0 1 279.799 16.592 Q 279.679 16.801 279.553 16.919 A 0.516 0.516 0 0 1 279.42 17.005 Q 279.212 17.104 278.809 17.139 Z M 45.987 9.021 A 10.739 10.739 0 0 0 43.384 8.716 A 17.475 17.475 0 0 0 41.958 8.773 A 14.608 14.608 0 0 0 37.305 9.912 Q 34.546 11.108 32.556 13.184 A 14.751 14.751 0 0 0 29.468 18.054 Q 28.369 20.85 28.369 24.048 A 14.977 14.977 0 0 0 28.46 25.716 A 12.091 12.091 0 0 0 29.517 29.541 Q 30.664 31.982 32.581 33.691 A 13.638 13.638 0 0 0 36.975 36.316 A 14.645 14.645 0 0 0 42.09 37.231 A 9.182 9.182 0 0 0 42.482 37.223 Q 42.822 37.208 43.202 37.169 A 17.181 17.181 0 0 0 43.97 37.073 A 22.109 22.109 0 0 0 44.511 36.986 A 25.082 25.082 0 0 0 46.191 36.633 Q 47.339 36.353 48.45 36.011 Q 49.561 35.669 50.427 35.303 A 14.552 14.552 0 0 0 50.877 35.104 Q 51.15 34.978 51.382 34.855 A 6.646 6.646 0 0 0 51.831 34.595 Q 52.368 34.253 52.368 33.96 A 0.472 0.472 0 0 0 52.368 33.949 Q 52.366 33.878 52.344 33.765 A 0.689 0.689 0 0 0 52.313 33.658 A 0.842 0.842 0 0 0 52.246 33.521 A 332.262 332.262 0 0 0 52.268 32.355 A 246.777 246.777 0 0 0 52.283 31.299 A 201.62 201.62 0 0 0 52.289 30.702 Q 52.295 30.077 52.295 29.59 A 69.776 69.776 0 0 1 52.296 29.275 Q 52.298 28.79 52.307 28.491 L 52.319 28.101 A 1.223 1.223 0 0 0 52.224 28.104 A 1.428 1.428 0 0 0 52.014 28.137 A 34.453 34.453 0 0 1 51.909 28.161 Q 51.854 28.174 51.792 28.188 A 65.267 65.267 0 0 1 51.636 28.223 A 40.851 40.851 0 0 1 51.215 28.43 A 46.864 46.864 0 0 1 49.878 29.053 A 22.618 22.618 0 0 1 47.949 29.81 A 15.383 15.383 0 0 1 45.862 30.359 A 11.169 11.169 0 0 1 45.726 30.384 A 12.078 12.078 0 0 1 43.604 30.566 Q 42.554 30.566 41.565 30.334 A 6.64 6.64 0 0 1 41.141 30.22 A 5.63 5.63 0 0 1 39.795 29.614 Q 39.014 29.126 38.501 28.369 Q 37.988 27.612 37.891 26.563 A 19.362 19.362 0 0 0 38.883 26.717 A 16.33 16.33 0 0 0 40.967 26.855 A 19.249 19.249 0 0 0 42.759 26.774 A 15.64 15.64 0 0 0 46.118 26.099 A 16.569 16.569 0 0 0 47.944 25.392 A 12.677 12.677 0 0 0 50.134 24.121 A 11.3 11.3 0 0 0 51.202 23.241 A 8.893 8.893 0 0 0 52.734 21.375 A 7.087 7.087 0 0 0 53.263 20.327 A 5.329 5.329 0 0 0 53.662 18.335 A 8.038 8.038 0 0 0 53.591 17.267 A 8.978 8.978 0 0 0 52.93 14.917 Q 52.197 13.208 50.842 11.829 A 10.133 10.133 0 0 0 50.131 11.171 A 11.108 11.108 0 0 0 47.595 9.583 A 9.18 9.18 0 0 0 45.987 9.021 Z M 57.337 18.229 A 15.236 15.236 0 0 0 56.226 24.048 A 15.597 15.597 0 0 0 56.291 25.492 A 12.866 12.866 0 0 0 57.275 29.431 A 15.163 15.163 0 0 0 57.28 29.441 A 12.553 12.553 0 0 0 60.144 33.594 A 12.838 12.838 0 0 0 64.429 36.279 A 13.688 13.688 0 0 0 65.766 36.718 A 15.114 15.114 0 0 0 69.751 37.231 Q 70.776 37.231 71.875 37.158 A 16.572 16.572 0 0 0 74.06 36.865 A 15.27 15.27 0 0 0 76.172 36.279 Q 77.197 35.913 78.076 35.327 A 0.018 0.018 0 0 0 78.083 35.313 Q 78.101 35.238 78.119 34.785 A 33.866 33.866 0 0 0 78.125 34.619 A 53.652 53.652 0 0 0 78.139 34.147 Q 78.146 33.896 78.151 33.615 A 108.521 108.521 0 0 0 78.162 32.898 Q 78.174 31.885 78.174 30.774 L 78.174 28.882 A 3.708 3.708 0 0 0 78.174 28.859 Q 78.172 28.536 78.113 28.418 Q 78.081 28.355 78.034 28.325 A 0.189 0.189 0 0 0 77.93 28.296 A 1.633 1.633 0 0 0 77.909 28.296 Q 77.78 28.298 77.734 28.32 A 12.452 12.452 0 0 1 74.927 29.456 Q 73.438 29.858 71.973 29.858 A 9.347 9.347 0 0 1 71.815 29.857 A 8.372 8.372 0 0 1 69.556 29.517 A 5.544 5.544 0 0 1 67.529 28.43 Q 66.65 27.686 66.126 26.501 A 5.108 5.108 0 0 1 65.998 26.185 Q 65.601 25.099 65.601 23.633 A 10.027 10.027 0 0 1 65.615 23.085 A 8.604 8.604 0 0 1 66.101 20.63 A 8.039 8.039 0 0 1 66.233 20.288 A 6.937 6.937 0 0 1 67.529 18.225 Q 68.457 17.212 69.751 16.638 A 6.417 6.417 0 0 1 70.966 16.241 A 7.792 7.792 0 0 1 72.656 16.064 Q 73.95 16.064 75.012 16.272 A 27.69 27.69 0 0 1 75.152 16.3 Q 76.129 16.496 76.892 16.724 Q 77.403 16.876 77.814 17.015 A 16.515 16.515 0 0 1 78.272 17.175 Q 78.833 17.383 79.126 17.383 A 1.174 1.174 0 0 0 79.207 17.38 Q 79.34 17.371 79.42 17.329 A 0.213 0.213 0 0 0 79.517 17.236 A 0.919 0.919 0 0 0 79.535 17.198 Q 79.56 17.141 79.574 17.088 A 0.481 0.481 0 0 0 79.59 16.968 A 9.68 9.68 0 0 1 79.596 16.633 Q 79.616 16.064 79.7 15.344 A 55.656 55.656 0 0 1 79.944 13.513 Q 80.028 12.956 80.102 12.485 A 96.948 96.948 0 0 1 80.188 11.951 A 36.291 36.291 0 0 0 80.202 11.867 Q 80.298 11.27 80.298 11.133 Q 80.298 11.111 79.933 10.819 A 31.999 31.999 0 0 0 79.822 10.73 Q 79.48 10.458 78.854 10.148 A 13.209 13.209 0 0 0 78.32 9.9 Q 77.663 9.611 76.766 9.356 A 21.274 21.274 0 0 0 75.684 9.082 Q 74.072 8.716 71.802 8.716 A 18.139 18.139 0 0 0 70.871 8.739 A 15.507 15.507 0 0 0 65.613 9.912 Q 62.769 11.108 60.681 13.184 A 15.092 15.092 0 0 0 57.41 18.054 A 14.762 14.762 0 0 0 57.337 18.229 Z M 158.374 8.521 L 156.86 16.089 A 1090.826 1090.826 0 0 1 156.317 16.037 A 1502.049 1502.049 0 0 1 155.713 15.979 A 13.375 13.375 0 0 0 154.806 15.924 A 15.646 15.646 0 0 0 154.37 15.918 A 13.42 13.42 0 0 0 152.185 16.101 Q 151.074 16.284 150.122 16.821 A 5.093 5.093 0 0 0 148.573 18.182 A 5.87 5.87 0 0 0 148.486 18.298 A 4.315 4.315 0 0 0 147.925 19.376 Q 147.705 19.983 147.607 20.728 A 35322.144 35322.144 0 0 1 147.526 21.59 Q 147.409 22.824 147.327 23.694 Q 147.217 24.854 147.168 25.598 A 136.884 136.884 0 0 1 147.144 25.952 Q 147.11 26.456 147.083 26.794 Q 147.046 27.246 147.022 27.637 A 1.203 1.203 0 0 1 147.02 27.685 Q 147.015 27.806 146.989 28.119 A 44.541 44.541 0 0 1 146.985 28.174 A 19.208 19.208 0 0 1 146.952 28.524 Q 146.937 28.679 146.917 28.847 A 33.979 33.979 0 0 1 146.875 29.199 A 32.409 32.409 0 0 0 146.805 29.81 A 40.603 40.603 0 0 0 146.741 30.469 A 40.603 40.603 0 0 1 146.677 31.128 A 32.409 32.409 0 0 1 146.607 31.738 Q 146.556 32.141 146.523 32.475 A 18.643 18.643 0 0 0 146.497 32.764 Q 146.462 33.175 146.46 33.287 A 0.716 0.716 0 0 0 146.46 33.301 Q 146.46 33.435 146.466 33.541 A 2.512 2.512 0 0 0 146.472 33.63 Q 146.484 33.765 146.484 33.887 A 0.374 0.374 0 0 1 146.368 34.159 A 0.567 0.567 0 0 1 146.301 34.216 Q 146.118 34.351 145.483 34.522 L 139.014 36.841 A 16.303 16.303 0 0 1 138.869 36.893 Q 138.668 36.964 138.397 37.055 A 52.272 52.272 0 0 1 138.306 37.085 A 2.873 2.873 0 0 1 137.766 37.211 A 2.449 2.449 0 0 1 137.451 37.231 A 1.154 1.154 0 0 1 137.117 37.185 A 0.985 0.985 0 0 1 136.853 37.061 Q 136.622 36.906 136.599 36.553 A 1.233 1.233 0 0 1 136.597 36.475 L 138.696 12.28 A 12.638 12.638 0 0 1 138.735 11.914 Q 138.795 11.417 138.874 11.186 A 1.089 1.089 0 0 1 138.879 11.169 Q 138.976 10.902 139.326 10.794 A 1.321 1.321 0 0 1 139.429 10.767 A 677.793 677.793 0 0 1 143.429 9.988 A 743.737 743.737 0 0 1 144.019 9.876 A 39.431 39.431 0 0 0 148.608 8.716 A 0.966 0.966 0 0 1 148.681 8.718 Q 148.79 8.727 148.828 8.762 A 0.068 0.068 0 0 1 148.84 8.777 A 0.21 0.21 0 0 1 148.861 8.826 Q 148.875 8.875 148.877 8.944 A 0.775 0.775 0 0 1 148.877 8.96 Q 148.877 9.009 148.865 9.106 A 1.999 1.999 0 0 1 148.859 9.152 Q 148.841 9.268 148.792 9.546 A 24.386 24.386 0 0 0 148.758 9.739 Q 148.703 10.061 148.621 10.58 A 19.331 19.331 0 0 0 148.621 10.584 Q 148.537 11.116 148.402 11.971 A 3828.806 3828.806 0 0 0 148.315 12.524 A 17.171 17.171 0 0 1 150.294 11.193 A 19.365 19.365 0 0 1 150.794 10.913 Q 152.149 10.181 153.516 9.656 A 22.618 22.618 0 0 1 155.187 9.085 A 19.041 19.041 0 0 1 156.152 8.826 Q 157.422 8.521 158.374 8.521 Z M 118.262 37.231 Q 114.819 37.231 112.219 36.108 A 13.731 13.731 0 0 1 109.298 34.414 A 11.937 11.937 0 0 1 107.861 33.118 A 12.316 12.316 0 0 1 105.225 28.821 A 14.705 14.705 0 0 1 104.346 23.779 Q 104.346 21.167 105.2 18.811 Q 106.055 16.455 107.593 14.587 Q 109.131 12.72 111.279 11.462 A 13.886 13.886 0 0 1 115.975 9.773 A 15.734 15.734 0 0 1 116.016 9.766 A 1.591 1.591 0 0 0 116.143 9.753 Q 116.336 9.725 116.388 9.653 A 0.098 0.098 0 0 0 116.406 9.595 A 2.093 2.093 0 0 0 116.382 9.273 A 1.771 1.771 0 0 0 116.345 9.094 A 2.212 2.212 0 0 1 116.308 8.929 Q 116.293 8.847 116.288 8.775 A 1.085 1.085 0 0 1 116.284 8.691 A 1.155 1.155 0 0 1 116.29 8.568 Q 116.309 8.399 116.382 8.325 A 0.36 0.36 0 0 1 116.465 8.262 A 0.283 0.283 0 0 1 116.602 8.228 Q 121.265 8.228 124.536 9.29 A 17.966 17.966 0 0 1 127.165 10.366 Q 128.597 11.097 129.694 12.039 A 10.998 10.998 0 0 1 129.858 12.183 Q 131.909 14.014 132.837 16.504 Q 133.765 18.994 133.765 21.851 A 18.537 18.537 0 0 1 133.44 25.394 A 14.563 14.563 0 0 1 132.544 28.345 A 14.524 14.524 0 0 1 130.226 32.118 A 13.369 13.369 0 0 1 129.211 33.179 A 14.409 14.409 0 0 1 124.28 36.194 A 17.174 17.174 0 0 1 118.66 37.227 A 19.501 19.501 0 0 1 118.262 37.231 Z M 210.205 37.231 Q 206.763 37.231 204.163 36.108 A 13.731 13.731 0 0 1 201.242 34.414 A 11.937 11.937 0 0 1 199.805 33.118 A 12.316 12.316 0 0 1 197.168 28.821 A 14.705 14.705 0 0 1 196.289 23.779 Q 196.289 21.167 197.144 18.811 Q 197.998 16.455 199.536 14.587 Q 201.074 12.72 203.223 11.462 A 13.886 13.886 0 0 1 207.919 9.773 A 15.734 15.734 0 0 1 207.959 9.766 A 1.591 1.591 0 0 0 208.087 9.753 Q 208.28 9.725 208.331 9.653 A 0.098 0.098 0 0 0 208.35 9.595 A 2.093 2.093 0 0 0 208.326 9.273 A 1.771 1.771 0 0 0 208.289 9.094 A 2.212 2.212 0 0 1 208.251 8.929 Q 208.237 8.847 208.231 8.775 A 1.085 1.085 0 0 1 208.228 8.691 A 1.155 1.155 0 0 1 208.234 8.568 Q 208.252 8.399 208.325 8.325 A 0.36 0.36 0 0 1 208.409 8.262 A 0.283 0.283 0 0 1 208.545 8.228 Q 213.208 8.228 216.48 9.29 A 17.966 17.966 0 0 1 219.108 10.366 Q 220.54 11.097 221.638 12.039 A 10.998 10.998 0 0 1 221.802 12.183 Q 223.853 14.014 224.78 16.504 Q 225.708 18.994 225.708 21.851 A 18.537 18.537 0 0 1 225.384 25.394 A 14.563 14.563 0 0 1 224.487 28.345 A 14.524 14.524 0 0 1 222.17 32.118 A 13.369 13.369 0 0 1 221.155 33.179 A 14.409 14.409 0 0 1 216.223 36.194 A 17.174 17.174 0 0 1 210.603 37.227 A 19.501 19.501 0 0 1 210.205 37.231 Z M 113.745 23.511 A 12.285 12.285 0 0 0 114.026 26.123 A 7.607 7.607 0 0 0 114.688 27.996 A 6.962 6.962 0 0 0 114.954 28.467 Q 115.601 29.517 116.65 30.164 A 4.171 4.171 0 0 0 117.952 30.678 Q 118.479 30.794 119.087 30.808 A 7.34 7.34 0 0 0 119.263 30.811 A 5.183 5.183 0 0 0 120.3 30.665 A 4.029 4.029 0 0 0 121.228 30.31 Q 122.07 29.858 122.681 29.138 Q 123.291 28.418 123.694 27.515 A 10.745 10.745 0 0 0 124.329 25.647 A 14.818 14.818 0 0 0 124.632 23.987 A 13.558 13.558 0 0 0 124.658 23.755 A 18.941 18.941 0 0 0 124.732 22.87 A 13.844 13.844 0 0 0 124.756 22.07 A 8.364 8.364 0 0 0 124.378 19.58 Q 123.999 18.359 123.267 17.432 Q 122.534 16.504 121.448 15.93 A 4.931 4.931 0 0 0 119.798 15.412 A 6.301 6.301 0 0 0 118.945 15.356 A 4.095 4.095 0 0 0 117.694 15.541 A 3.431 3.431 0 0 0 116.48 16.223 A 6.359 6.359 0 0 0 114.923 18.271 A 7.295 7.295 0 0 0 114.88 18.359 Q 114.282 19.629 114.014 21.033 A 17.086 17.086 0 0 0 113.835 22.159 Q 113.768 22.707 113.751 23.193 A 9.182 9.182 0 0 0 113.745 23.511 Z M 205.689 23.511 A 12.285 12.285 0 0 0 205.969 26.123 A 7.607 7.607 0 0 0 206.632 27.996 A 6.962 6.962 0 0 0 206.897 28.467 Q 207.544 29.517 208.594 30.164 A 4.171 4.171 0 0 0 209.895 30.678 Q 210.423 30.794 211.031 30.808 A 7.34 7.34 0 0 0 211.206 30.811 A 5.183 5.183 0 0 0 212.244 30.665 A 4.029 4.029 0 0 0 213.171 30.31 Q 214.014 29.858 214.624 29.138 Q 215.234 28.418 215.637 27.515 A 10.745 10.745 0 0 0 216.272 25.647 A 14.818 14.818 0 0 0 216.575 23.987 A 13.558 13.558 0 0 0 216.602 23.755 A 18.941 18.941 0 0 0 216.675 22.87 A 13.844 13.844 0 0 0 216.699 22.07 A 8.364 8.364 0 0 0 216.321 19.58 Q 215.942 18.359 215.21 17.432 Q 214.478 16.504 213.391 15.93 A 4.931 4.931 0 0 0 211.742 15.412 A 6.301 6.301 0 0 0 210.889 15.356 A 4.095 4.095 0 0 0 209.637 15.541 A 3.431 3.431 0 0 0 208.423 16.223 A 6.359 6.359 0 0 0 206.866 18.271 A 7.295 7.295 0 0 0 206.824 18.359 Q 206.226 19.629 205.957 21.033 A 17.086 17.086 0 0 0 205.778 22.159 Q 205.711 22.707 205.694 23.193 A 9.182 9.182 0 0 0 205.689 23.511 Z M 43.091 15.21 A 4.083 4.083 0 0 0 41.596 15.481 A 3.891 3.891 0 0 0 41.248 15.637 A 4.924 4.924 0 0 0 40.072 16.479 A 5.954 5.954 0 0 0 39.71 16.858 A 7.235 7.235 0 0 0 38.911 17.974 A 9.096 9.096 0 0 0 38.501 18.762 Q 37.988 19.873 37.671 21.216 Q 40.186 20.776 41.846 20.288 Q 42.961 19.96 43.779 19.626 A 10.497 10.497 0 0 0 44.507 19.299 A 7.71 7.71 0 0 0 45.05 19.002 Q 45.57 18.687 45.858 18.373 A 1.999 1.999 0 0 0 45.923 18.298 A 2.297 2.297 0 0 0 46.148 17.978 Q 46.338 17.647 46.338 17.334 A 1.187 1.187 0 0 0 46.16 16.715 A 1.619 1.619 0 0 0 46.008 16.504 A 3.099 3.099 0 0 0 45.432 15.978 A 3.706 3.706 0 0 0 45.19 15.82 Q 44.702 15.527 44.128 15.369 Q 43.615 15.227 43.19 15.212 A 2.816 2.816 0 0 0 43.091 15.21 Z



        `);

        polyLine1.pos.setXY(0,0);
        polyLine1.color = Color.RGB(100,20,222);
        polyLine1.lineWidth = 2;
        this.appendChild(polyLine1);
        polyLine1.addBehaviour(new DraggableBehaviour(this.game));

    }

    public onProgress(val: number) {

    }

    public onReady() {

    }

}
