#include<iostream>
using namespace std;
#include<stack>
int main(){

    string str="((a+b)+c)";
    stack<char>s;

    for(int i=0;i<str.length();i++){
        char ch=str[i];
        if(str[i]==')'){

            if(s.top()=='('){
                cout<<"False";
                break;
            }else{
                while(s.top()!='('){
                    s.pop();
                }
            }

        }else{
            s.push(ch);
        }
    }
    if(s.empty()){
        cout<<"True";
    }else{
        cout<<"False";
    }



    
}